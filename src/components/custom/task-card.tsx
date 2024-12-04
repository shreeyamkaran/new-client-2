import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { ShieldCheck, CalendarDays, Clock, Trash2, Pencil } from 'lucide-react';
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
    value: string,
    task: {
        appraisalStatus: string;
        date: string;
        description: string;
        duration: number;
        id: number;
        title: string;
        projectId: number;
        projectName: string;
    }
}

export default function TaskCard({ value, task }: TaskCardProps) {
    const navigate = useNavigate();
    const formatdate = (taskDate: string) => {
        const date = new Date(taskDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        return formattedDate;
    }

    const getColor = () => {
        switch(task.appraisalStatus) {
            case "DID_NOT_APPLY": return "light:text-black dark:text-white";
            default: return "text-yellow-400";
        }
    }

    return (
        <AccordionItem value={ value }>
            <AccordionTrigger>
                <div className="flex flex-col gap-2 lg:flex-row lg:justify-between px-2 sm:px-20 items-start w-full">
                    <div className="flex gap-4 justify-start">
                        <ShieldCheck className={ `${ getColor() }` } />
                        <Badge>{ task.projectName }</Badge>
                    </div>
                    <div>
                        <p className="text-lg flex justify-center">{ task.title }</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={ 16 } />
                            <p>{ formatdate(task.date) }</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={ 16 } />
                            <p>{ task.duration } minutes</p>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="px-2 sm:px-20 flex flex-col gap-4">
                    <p>{ task.description }</p>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={ () => navigate("/tasks/add", { state: { task } }) }><Pencil /> Edit Task</Button>
                        <Button variant="destructive" size="sm"><Trash2 /> Delete Task</Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}