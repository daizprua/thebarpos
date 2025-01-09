import { Card } from "@/components/ui/card";
import { isAdmin } from "@/lib/auth";
import { UserManagementCard } from "@/components/control-panel/UserManagementCard";
import { LimitedAccessCard } from "@/components/control-panel/LimitedAccessCard";
import { MenuOrderCard } from "@/components/control-panel/MenuOrderCard";
import { DataSyncCard } from "@/components/control-panel/DataSyncCard";

const ControlPanel = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Control Panel</h1>
        </div>

        {isAdmin(user) ? (
          <div className="grid gap-6">
            <DataSyncCard />
            <UserManagementCard />
            <MenuOrderCard />
          </div>
        ) : (
          <LimitedAccessCard />
        )}
      </div>
    </div>
  );
};

export default ControlPanel;