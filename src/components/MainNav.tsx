import { Link } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Store, Package } from "lucide-react";

export function MainNav() {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4 bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="font-bold text-white">Menu</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link to="/pos" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>POS</span>
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}