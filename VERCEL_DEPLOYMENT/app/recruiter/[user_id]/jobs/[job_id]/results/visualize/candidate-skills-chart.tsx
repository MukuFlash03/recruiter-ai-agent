"use client";
import React from 'react';
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface CandidateCharacteristics {
  problem_solving: string;
  technical_skills: string;
  leadership: string;
  communication: string;
  teamwork: string;
  adaptability: string;
  creativity: string;
}

interface Candidate {
  id: string;
  name: string;
  characteristics: CandidateCharacteristics;
}

interface CandidateSkillsChartProps {
  candidates: Candidate[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CandidateSkillsChart: React.FC<CandidateSkillsChartProps> = ({ candidates }) => {
  const formatData = (candidates: Candidate[]) => {
    const skills = Object.keys(candidates[0].characteristics);
    return skills.map(skill => {
      const dataPoint: { [key: string]: string | number } = { skill };
      candidates.forEach(candidate => {
        dataPoint[candidate.name] = parseInt(candidate.characteristics[skill as keyof CandidateCharacteristics], 10);
      });
      return dataPoint;
    });
  };

  const chartData = formatData(candidates);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis angle={30} domain={[0, 5]} />
        {candidates.map((candidate, index) => (
          <Radar
            key={candidate.id}
            name={candidate.name}
            dataKey={candidate.name}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.6}
          />
        ))}
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CandidateSkillsChart;
