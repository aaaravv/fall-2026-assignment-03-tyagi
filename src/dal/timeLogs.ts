// TODO: Student implementation - Part 2: DAL for time logs
import {db} from '../db/database.js';

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<any> {
  // TODO: Student implementation
  return await db
  .insertInto('time_logs')
  .values({ticket_id: ticketId, user_id: userId, hours})
  .returningAll()
  .executeTakeFirstOrThrow();
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  let sum = await db
  .selectFrom('time_logs')
  .select((sum) => sum.fn.sum('hours').as('total_hours'))
  .where('ticket_id', '=', ticketId)
  .executeTakeFirst();

  return Number(sum?.total_hours??0)
}
