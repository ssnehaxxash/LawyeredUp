
import { AlertTriangle, CheckCircle2, Handshake } from "lucide-react";

export const riskIcons = {
    risky: <AlertTriangle className="h-5 w-5 text-destructive" />,
    negotiable: <Handshake className="h-5 w-5 text-yellow-500" />,
    standard: <CheckCircle2 className="h-5 w-5 text-green-500" />,
};

export const riskColors = {
    risky: "bg-destructive/10 hover:bg-destructive/20 text-foreground",
    negotiable: "bg-yellow-500/10 hover:bg-yellow-500/20 text-foreground",
    standard: "",
};
