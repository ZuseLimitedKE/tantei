import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./input";
import { X } from "lucide-react";

export function ChatDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row  border border-red-500 justify-between">
          <div className="space-y-1">
            <DrawerTitle>Chat</DrawerTitle>
            <DrawerDescription>Chat with our bot.</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="outline"
              className="hover:text-red-800 text-black hover:bg-gray-50 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-2 min-h-96"></div>

        <div className="mx-auto w-full max-w-lg">
          <DrawerFooter>
            <Input className="w-full" />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
