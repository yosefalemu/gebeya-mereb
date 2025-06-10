"use client";
import { Button } from "@/components/ui/button";
import SendRequest from "@/features/booking/component/send-request";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import RecieveRequest from "@/features/booking/component/recieve-request";

export default function BookingPage() {
  const [status, setStatus] = useState<"send" | "receive">("send");
  const queryClient = useQueryClient();

  const handleStatusChange = (newStatus: "send" | "receive") => {
    setStatus(newStatus);
    queryClient.invalidateQueries({ queryKey: ["get-send-request"] });
    queryClient.invalidateQueries({ queryKey: ["get-recieved-request"] });
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center">
        <Button
          className="rounded-none cursor-pointer px-14"
          variant={status === "send" ? "default" : "outline"}
          onClick={() => handleStatusChange("send")}
        >
          SEND
        </Button>
        <Button
          className="rounded-none cursor-pointer px-14"
          variant={status === "receive" ? "default" : "outline"}
          onClick={() => handleStatusChange("receive")}
        >
          RECEIVE
        </Button>
      </div>
      <div>
        {status === "send" ? (
          <SendRequest key="send" />
        ) : (
          <RecieveRequest key="receive" />
        )}
      </div>
    </div>
  );
}
