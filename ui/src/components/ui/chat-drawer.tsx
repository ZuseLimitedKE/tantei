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
import { IconSend } from "@tabler/icons-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
export function ChatDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row  items-center justify-between">
          <div className="space-y-1">
            <DrawerTitle className="font-semibold text-xl">
              Tantei Assistant
            </DrawerTitle>
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
        <ScrollArea className="flex-1 p-4 min-h-72"></ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Input placeholder="Ask me anything..." className="flex-1" />
            <Button size="icon">
              <IconSend className="h-4 w-4" />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
