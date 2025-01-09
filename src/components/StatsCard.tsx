import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <Card className="card-base">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="text-primary text-2xl">{icon}</div>
      </div>
    </Card>
  );
};