import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/core";

const data = {
  "generalStats": {
    "mmr": "1155",
    "wlRatioMultiplayer": "0.83",
    "kdRatioMultiplayer": "0.87",
    "totalGameTimeMultiplayer": "74h43m",
    "totalGamesPlayedMultiplayer": "251",
    "kills": "855",
    "assists": "318",
    "deaths": "978",
    "revives": "31",
    "headshots": "399",
    "penetrationKills": "45",
    "meeleeKills": "17",
    "matchesWon": "114",
    "matchesLost": "137",
  },
}

const General = () => {
  return (
    <Box p={25}>
      <StatGroup>
        <Stat textAlign="center">
          <StatLabel>MMR</StatLabel>
          <StatNumber>{data.generalStats.mmr}</StatNumber>
          <StatHelpText>
            Copper IV
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>W/L Ratio Multiplayer</StatLabel>
          <StatNumber>{data.generalStats.wlRatioMultiplayer}</StatNumber>
          <StatHelpText>
            {data.generalStats.matchesWon} Wins<br/>
            {data.generalStats.matchesLost} Loses
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>K/D Ratio Multiplayer</StatLabel>
          <StatNumber>{data.generalStats.kdRatioMultiplayer}</StatNumber>
          <StatHelpText>
            {data.generalStats.kills} Kills<br/>
            {data.generalStats.deaths} Deaths
          </StatHelpText>
        </Stat>
      </StatGroup>
      <StatGroup>
        <Stat textAlign="center">
          <StatLabel>Kills</StatLabel>
          <StatNumber>{data.generalStats.kills}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23 since yesterday
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>Assists</StatLabel>
          <StatNumber>{data.generalStats.assists}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23 since yesterday
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>Deaths</StatLabel>
          <StatNumber>{data.generalStats.deaths}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23 since yesterday
          </StatHelpText>
        </Stat>
      </StatGroup>
      <StatGroup>
        <Stat textAlign="center">
          <StatLabel>Revives</StatLabel>
          <StatNumber>{data.generalStats.revives}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>Headshots</StatLabel>
          <StatNumber>{data.generalStats.headshots}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>penetrationKills</StatLabel>
          <StatNumber>{data.generalStats.penetrationKills}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
        <Stat textAlign="center">
          <StatLabel>meeleeKills</StatLabel>
          <StatNumber>{data.generalStats.meeleeKills}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Box>
  ); 
}

export default General;