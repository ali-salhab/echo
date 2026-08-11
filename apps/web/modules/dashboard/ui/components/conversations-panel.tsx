"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,

} from "@workspace/ui/components/select"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { ListIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon } from "lucide-react"
const ConversationsPanel = () => {
    return (
        <div className="flex flex-col w-14 bg-background text-sidebar-foreground  rounded-lg">
            <div className="flex flex-col gap-3.5 border-b p-2 ">
                <Select
                    defaultValue="all"
                    onValueChange={() => { }}
                    value={"all"}
                >
                    <SelectTrigger className="h-8 border-none px-1.5 shadow-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <ListIcon className="w-4 h-4" />
                                <span>All</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="unresolved">
                            <div className="flex items-center gap-2">
                                <ArrowRightIcon className="w-4 h-4" />
                                <span>unresolved</span>
                            </div>
                        </SelectItem>   <SelectItem value="escalated">
                            <div className="flex items-center gap-2">
                                <ArrowUpIcon className="w-4 h-4" />
                                <span>escalated</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                            <div className="flex items-center gap-2">
                                <CheckIcon className="w-4 h-4" />
                                <span>resolved</span>
                            </div>
                        </SelectItem>



                    </SelectContent>

                </Select>
            </div>
            <ScrollArea className="max-h-[calc(100vh-10rem)]">
                <div className="flex w-full flex-1 flex-col text-sm">

                </div>
            </ScrollArea>
        </div>
    )
}

export default ConversationsPanel