import { describe, it, expect, beforeEach} from 'vitest';
import {db} from '../src/db/database.js';
import { exec } from 'child_process';
import request from 'supertest';
import { app } from '../src/index.js';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Part 2: Time Logs Tests', () => {
  beforeEach(async () => {
    await execAsync('npm run seed');
  });
  

  it('should return 2 hour sum for 1 ticket with 2 hour spent', async() => {
    let ticid = 1;

    let test = await request(app).post(`/tickets/1/time`).set('X-User-Id', '1').send({hours: 2});
    let hourSum = await request(app).get(`/tickets/1/time`);

    expect(test.status).toBe(201);
    expect(hourSum.body.ticket_id).toBe(1);
    expect(hourSum.body.total_hours).toBe(2);

  });

});
