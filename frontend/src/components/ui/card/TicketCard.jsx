import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import { Tag } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../select";

const TicketCard = ({ ticket }) => {
  return (
    <Card>
      <CardContent className={"flex flex-col gap-4"}>
        <div className={"flex justify-between"}>
          <span>23ofg7</span>
          <span>{new Date(ticket.createdAt).toLocaleTimeString()}</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-primary">
            {ticket.title}
          </h2>
          <p className="text-base font-medium text-muted-foreground leading-6">
            {ticket.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span>
              {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
            </span>
            <div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Tag />
                <span>{ticket.tags.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Priority: {ticket.priority}</span>
            <Select value={ticket.status}>
              <SelectTrigger>
                <SelectValue placeholder={ticket.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;

// {
//     "aiAnalysis": {
//       "sentiment": "negative",
//       "keywords": ["software", "crash", "error"]
//     },
//     "category": "Software",
//     "description": "User reports that a critical software crashes immediately upon launch, preventing work.",
//     "priority": "High",
//     "source": "Chatbot",
//     "status": "Open",
//     "subcategory": "Software Crash",
//     "tags": ["software", "crash", "error"],
//     "title": "Critical Software Crash on Launch",
//     "createdAt": "2025-10-04T16:05:00.000Z",
//     "assignedTo": {
//       "email": "jane.smith@example.com",
//       "emp_id": "EMP102",
//       "name": "Jane Smith"
//     }
// },
