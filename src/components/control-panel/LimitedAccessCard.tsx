import { Card } from "@/components/ui/card";

export const LimitedAccessCard = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Limited Access</h2>
      <p>You don't have permission to view user management settings.</p>
    </Card>
  );
};