
import { Folder, Search, File, ChevronLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { CollapsibleSidebarButton } from './collapsible-sidebar-button';

type LeftSidebarProps = {
    documentTitle: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
};

export default function LeftSidebar({ documentTitle, isCollapsed, onToggleCollapse }: LeftSidebarProps) {
  return (
    <aside className={cn(
        "bg-card border-r flex flex-col shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-0" : "w-[320px]"
    )}>
      <div className="p-4 border-b flex items-center justify-between relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-10" />
        </div>
        <CollapsibleSidebarButton
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            side="left"
            className="ml-2"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Current Document</h3>
            <div className="bg-primary/10 rounded-md p-2 flex items-center gap-2">
                <File className="h-4 w-4 text-primary"/>
                <span className="text-sm font-medium text-primary truncate">{documentTitle}</span>
            </div>

            <h3 className="text-sm font-semibold text-muted-foreground mb-2 mt-6 px-2">All Documents</h3>
             <ul className="space-y-1">
                <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                    <Folder className="h-4 w-4"/>
                    <span>Employment Contracts</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                    <File className="h-4 w-4"/>
                    <span>Consulting Agreement.docx</span>
                </li>
                 <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                    <File className="h-4 w-4"/>
                    <span>Past Lease 2022.pdf</span>
                </li>
            </ul>

        </div>

        <Accordion type="multiple" defaultValue={['filters', 'settings']} className="w-full px-4">
          <AccordionItem value="filters">
            <AccordionTrigger className="text-sm font-semibold text-muted-foreground">Filters</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-semibold">By Risk</Label>
                <Select>
                  <SelectTrigger className="w-full mt-1 h-9">
                    <SelectValue placeholder="All Risks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risky">Risky</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">By Clause Type</Label>
                <Select>
                  <SelectTrigger className="w-full mt-1 h-9">
                    <SelectValue placeholder="All Clauses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="termination">Termination</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label className="text-xs font-semibold">Role Lens</Label>
                <Select defaultValue="tenant">
                  <SelectTrigger className="w-full mt-1 h-9">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="smb">SMB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="settings">
            <AccordionTrigger className="text-sm font-semibold text-muted-foreground">View Settings</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="comparison-mode" className="text-sm">Comparison Mode</Label>
                <Switch id="comparison-mode" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
}