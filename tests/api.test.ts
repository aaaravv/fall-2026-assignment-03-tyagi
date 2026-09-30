import { describe, it, expect, beforeEach} from 'vitest';
import {execSync} from 'child_process';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {

  //reset db before eachtest
  beforeEach(() => {
    execSync('npm run seed');
  });

  //user tests
  it('should get all users when requested correctly', async() => {
    let userList = await request(app).get('/users');

    expect(userList.status).toBe(200);
    expect(userList.body.length).toBe(5);
  });

  it('should retrieve by ID successfully if correct id is given', async() => {
    
    let resp = (await request(app).get('/users/1'));
    
    expect(resp.status).toBe(200);
    expect(resp.body.id).toBe(1);
  });

  it('should retrieve by ID unsuccessfully if nonexistent id is given', async() => {
    let resp = await request(app).get('/users/0');
    
    expect(resp.status).toBe(404);
  });

  it('should create user successfully if correct inputs are given', async() => {
    let inputUser = {name: 'name', email: 'name@gmail.com'};
    let resp = await request(app).post('/users').send(inputUser);

    expect(resp.status).toBe(201);
  });

  it('should create user unsuccessfully if wrong inputs are given', async() => {
    let inputUser = {name: 1};
    let resp = await request(app).post('/users').send(inputUser);

    expect(resp.status).toBe(422);
  });

  //tickets test
  it('should return 10 tickets when requested, due to default pagination', async() => {
    let tixList = await request(app).get('/tickets');

    expect(tixList.status).toBe(200);
    expect(tixList.body.length).toBe(10);
    expect(tixList.body[0].status).toBe('TODO');
  })

  it('should retrieve by tickets by ID successfully if correct id is given', async() => {
    
    let resp = (await request(app).get('/tickets/1'));
    
    expect(resp.status).toBe(200);
    expect(resp.body.status).toBe('TODO');
  });

  it('should retrieve by tickets by ID unsuccessfully if wrong id is given, auth middleware is triggered and rejects the NaN test id', async() => {
    
    let resp = (await request(app).post('/tickets').set('X-User-Id', 'hello'));
    
    expect(resp.status).toBe(401);
  });  

  it('should change ticket index 1s TODO to hello', async() => {
    let change = await (await request(app).patch('/tickets/1/status').set('X-User-Id', '1').send({status: 'hello'}));
    let check = await request(app).get('/tickets/1');

    expect(change.status).toBe(200);
    expect(check.body.status).toBe('hello');
  })

  it('should fail to change ticket index 1s TODO to hello when given wrong user id', async() => {
    let change = await (await request(app).patch('/tickets/1/status').set('X-User-Id', 'wrong').send({status: 'hello'}));
    expect(change.status).toBe(401);
  })

});
