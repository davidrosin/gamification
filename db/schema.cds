using { cuid, managed } from '@sap/cds/common';

namespace goodvibes;

entity Players : cuid, managed {
  name        : String(100);
  email       : String(255);
  totalPoints : Integer default 0;
}

entity Seasons : cuid, managed {
  name      : String(100);
  startDate : Date;
  endDate   : Date;
  isActive  : Boolean default true;
}

entity Matches : cuid, managed {
  playedAt : Timestamp;
  season   : Association to Seasons;
}

entity Scores : cuid, managed {
  player : Association to Players;
  match  : Association to Matches;
  points : Integer;
}
