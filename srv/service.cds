using { goodvibes as gv } from '../db/schema';

service GameService {
  entity Players as projection on gv.Players;
  entity Seasons as projection on gv.Seasons;
  entity Matches as projection on gv.Matches;
  entity Scores  as projection on gv.Scores;

  @readonly
  function TopSeasonPlayers(seasonID: UUID)
    returns many {
      playerID : UUID;
      name     : String;
      points   : Integer;
    };
}
