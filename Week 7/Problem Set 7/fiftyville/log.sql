-- Keep a log of any SQL queries you execute as you solve the mystery.
-- See what each table has
.schema

-- Since we know place and date, get other information from reports about crime scenes at that place and date
SELECT * FROM crime_scene_reports WHERE year = 2021 AND month = 7 AND day = 28 AND street = 'Humphrey Street';

-- We get id:295 and description: Theft of the CS50 duck took place at 10:15am at the Humphrey Street bakery.
-- Interviews were conducted today with three witnesses who were present at the time – each of their interview transcripts
-- mentions the bakery.
-- We also get id:297 and description: Littering took place at 16:36. No known witnesses.
-- But we are only interested in the crime with id:295.

SELECT * FROM interviews WHERE transcript LIKE '%bakery%';
-- We get 5 interviews with ids: 161, 162, 163, 192 and 193.
-- We rule out 192 because the date does not match.
-- 161: Sometime within ten minutes of the theft, I saw the thief get into a car in the bakery parking lot
-- and drive away. If you have security footage from the bakery parking lot, you might want to look for cars
-- that left the parking lot in that time frame. RUTH
-- 162: I don't know the thief's name, but it was someone I recognized. Earlier this morning, before I arrived
-- at Emma's bakery, I was walking by the ATM on Leggett Street and saw the thief there withdrawing some money. EUGENE
-- 163: As the thief was leaving the bakery, they called someone who talked to them for less than a minute. In the
-- call, I heard the thief say that they were planning to take the earliest flight out of Fiftyville tomorrow. The
-- thief then asked the person on the other end of the phone to purchase the flight ticket. RAYMOND
-- 193: I'm the bakery owner, and someone came in, suspiciously whispering into a phone for about half an hour. They
-- never bought anything. EMMA

SELECT * FROM bakery_security_logs WHERE year = 2021 AND month = 7 AND day = 28 AND hour = 10 AND minute <= 25 and activity = 'exit';
-- Executing this query according to the first interview by Ruth, we get 8 liscence plates exiting the parking, with
-- the following ids: 260, 261, 262, 263, 264, 265, 266 and 267.
-- +-----+------+-------+-----+------+--------+----------+---------------+
-- | id  | year | month | day | hour | minute | activity | license_plate |
-- +-----+------+-------+-----+------+--------+----------+---------------+
-- | 260 | 2021 | 7     | 28  | 10   | 16     | exit     | 5P2BI95       |
-- | 261 | 2021 | 7     | 28  | 10   | 18     | exit     | 94KL13X       |
-- | 262 | 2021 | 7     | 28  | 10   | 18     | exit     | 6P58WS2       |
-- | 263 | 2021 | 7     | 28  | 10   | 19     | exit     | 4328GD8       |
-- | 264 | 2021 | 7     | 28  | 10   | 20     | exit     | G412CB7       |
-- | 265 | 2021 | 7     | 28  | 10   | 21     | exit     | L93JTIZ       |
-- | 266 | 2021 | 7     | 28  | 10   | 23     | exit     | 322W7JE       |
-- | 267 | 2021 | 7     | 28  | 10   | 23     | exit     | 0NTHK55       |
-- +-----+------+-------+-----+------+--------+----------+---------------+

SELECT * FROM atm_transactions
WHERE year = 2021 AND month = 7 AND day = 28 AND atm_location = 'Leggett Street' AND transaction_type = 'withdraw';
-- Executing this query according to Eugene, we get the following table:
-- +-----+----------------+------+-------+-----+----------------+------------------+--------+
-- | id  | account_number | year | month | day |  atm_location  | transaction_type | amount |
-- +-----+----------------+------+-------+-----+----------------+------------------+--------+
-- | 246 | 28500762       | 2021 | 7     | 28  | Leggett Street | withdraw         | 48     |
-- | 264 | 28296815       | 2021 | 7     | 28  | Leggett Street | withdraw         | 20     |
-- | 266 | 76054385       | 2021 | 7     | 28  | Leggett Street | withdraw         | 60     |
-- | 267 | 49610011       | 2021 | 7     | 28  | Leggett Street | withdraw         | 50     |
-- | 269 | 16153065       | 2021 | 7     | 28  | Leggett Street | withdraw         | 80     |
-- | 288 | 25506511       | 2021 | 7     | 28  | Leggett Street | withdraw         | 20     |
-- | 313 | 81061156       | 2021 | 7     | 28  | Leggett Street | withdraw         | 30     |
-- | 336 | 26013199       | 2021 | 7     | 28  | Leggett Street | withdraw         | 35     |
-- +-----+----------------+------+-------+-----+----------------+------------------+--------+

SELECT * FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60;
-- Executing the above query accroding to Raymond we get:
-- +-----+----------------+----------------+------+-------+-----+----------+
-- | id  |     caller     |    receiver    | year | month | day | duration |
-- +-----+----------------+----------------+------+-------+-----+----------+
-- | 221 | (130) 555-0289 | (996) 555-8899 | 2021 | 7     | 28  | 51       |
-- | 224 | (499) 555-9472 | (892) 555-8872 | 2021 | 7     | 28  | 36       |
-- | 233 | (367) 555-5533 | (375) 555-8161 | 2021 | 7     | 28  | 45       |
-- | 251 | (499) 555-9472 | (717) 555-1342 | 2021 | 7     | 28  | 50       |
-- | 254 | (286) 555-6063 | (676) 555-6554 | 2021 | 7     | 28  | 43       |
-- | 255 | (770) 555-1861 | (725) 555-3243 | 2021 | 7     | 28  | 49       |
-- | 261 | (031) 555-6622 | (910) 555-3251 | 2021 | 7     | 28  | 38       |
-- | 279 | (826) 555-1652 | (066) 555-9701 | 2021 | 7     | 28  | 55       |
-- | 281 | (338) 555-6650 | (704) 555-2131 | 2021 | 7     | 28  | 54       |
-- +-----+----------------+----------------+------+-------+-----+----------+

SELECT * FROM flights WHERE year = 2021 AND month = 7 AND day = 29 ORDER BY hour;
-- Then we execute this query according to Raymond to find all flights out of Fiftyville the following day,
-- 29/07/2021, and we choose the earliest according to Raymond, so we have:
-- +----+-------------------+------------------------+------+-------+-----+------+--------+
-- | id | origin_airport_id | destination_airport_id | year | month | day | hour | minute |
-- +----+-------------------+------------------------+------+-------+-----+------+--------+
-- | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |

SELECT * FROM passengers JOIN flights ON flights.id = passengers.flight_id WHERE id = 36;
-- We execute this query to find all passengers of the flight above, since we definitely know that the thief was in the flight.
-- We get this table:
-- +-----------+-----------------+------+----+-------------------+------------------------+------+-------+-----+------+--------+
-- | flight_id | passport_number | seat | id | origin_airport_id | destination_airport_id | year | month | day | hour | minute |
-- +-----------+-----------------+------+----+-------------------+------------------------+------+-------+-----+------+--------+
-- | 36        | 7214083635      | 2A   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 1695452385      | 3B   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 5773159633      | 4A   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 1540955065      | 5C   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 8294398571      | 6C   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 1988161715      | 6D   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 9878712108      | 7A   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- | 36        | 8496433585      | 7B   | 36 | 8                 | 4                      | 2021 | 7     | 29  | 8    | 20     |
-- +-----------+-----------------+------+----+-------------------+------------------------+------+-------+-----+------+--------+

SELECT DISTINCT full_name FROM airports JOIN flights ON flights.destination_airport_id = airports.id WHERE destination_airport_id = 4;
-- We know the destination airport id is 4 from the above table, so we search for the name of the airport with id 4,
-- which is LaGuardia airport, so they flew to LaGuardia, NY.

SELECT name FROM people WHERE license_plate IN ('5P2BI95', '94KL13X', '6P58WS2', '4328GD8', 'G412CB7', 'L93JTIZ', '322W7JE', '0NTHK55')
AND passport_number IN (7214083635, 1695452385, 5773159633, 1540955065, 8294398571, 1988161715, 9878712108, 8496433585)
INTERSECT
SELECT name FROM people JOIN bank_accounts ON bank_accounts.person_id = people.id WHERE account_number IN (28500762, 28296815,
76054385, 49610011, 16153065, 25506511, 81061156, 26013199)
INTERSECT
SELECT name FROM people WHERE phone_number IN ('(130) 555-0289', '(499) 555-9472', '(367) 555-5533', '(499) 555-9472', '(286) 555-6063',
 '(770) 555-1861', '(031) 555-6622');
-- This intersection gives us the thief, since the licence plate has to be in the logs from the bakery, the passport number has to
-- be in the flight from Fiftyville to LaGuardia, the bank account number has to be on those of the transaction mathcing Eugene's
-- interview and the phone number has to be in the caller column of the phone calls table, with all the calls made in the time frame
-- and lasting less than 60 seconds. So the thief is Bruce.
-- +-------+
-- | name  |
-- +-------+
-- | Bruce |
-- +-------+

SELECT * FROM people WHERE name = 'Bruce';
-- We find Bruce's phone number to find the accomplice.
-- +--------+-------+----------------+-----------------+---------------+
-- |   id   | name  |  phone_number  | passport_number | license_plate |
-- +--------+-------+----------------+-----------------+---------------+
-- | 686048 | Bruce | (367) 555-5533 | 5773159633      | 94KL13X       |
-- +--------+-------+----------------+-----------------+---------------+

SELECT * FROM phone_calls WHERE caller = '(367) 555-5533'
INTERSECT
SELECT * FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60;
-- We find the phone call between Bruce and the accomplice.
-- +-----+----------------+----------------+------+-------+-----+----------+
-- | id  |     caller     |    receiver    | year | month | day | duration |
-- +-----+----------------+----------------+------+-------+-----+----------+
-- | 233 | (367) 555-5533 | (375) 555-8161 | 2021 | 7     | 28  | 45       |
-- +-----+----------------+----------------+------+-------+-----+----------+

SELECT name FROM people WHERE phone_number = '(375) 555-8161';
-- We find the accomplice through the phone call, since the thief called the accomplice. We find Robin is the accomplice.
-- +-------+
-- | name  |
-- +-------+
-- | Robin |
-- +-------+