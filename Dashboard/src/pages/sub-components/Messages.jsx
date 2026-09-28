import { Button } from "@/components/ui/button";
import {
  clearAllMessageErrors,
  deleteMessage,
  getAllMessages,
  resetMessagesSlice,
} from "@/store/slices/messageSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";

const Messages = () => {
  const { messages, loading, error, message } = useSelector((state) => state.messages);

  const [messageId, setMessageId] = useState("");
  const dispatch = useDispatch();

  const handleMessageDelete = (id) => {
    setMessageId(id);
    dispatch(deleteMessage(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllMessageErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetMessagesSlice());
      dispatch(getAllMessages());
    }
  }, [dispatch, error, message, loading]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-2xl font-bold">
        <span className="text-gradient">Messages</span>
      </h1>

      <div className="grid sm:grid-cols-2 gap-4">
        {messages && messages.length > 0 ? (
          messages.map((element) => (
            <div key={element._id} className="terminal-window p-5 flex flex-col gap-3">
              <p className="font-mono text-sm">
                <span className="text-primary">sender:</span> {element.senderName}
              </p>
              {element.email && (
                <p className="font-mono text-sm">
                  <span className="text-primary">email:</span> {element.email}
                </p>
              )}
              {element.phone && (
                <p className="font-mono text-sm">
                  <span className="text-primary">phone:</span> {element.phone}
                </p>
              )}
              <p className="font-mono text-sm">
                <span className="text-primary">subject:</span> {element.subject}
              </p>
              <p className="text-sm text-muted-foreground">{element.message}</p>
              <div className="flex justify-end mt-2">
                {loading && messageId === element._id ? (
                  <SpecialLoadingButton content="Deleting" width="w-32" />
                ) : (
                  <Button
                    variant="outline"
                    className="w-32 border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => handleMessageDelete(element._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="font-mono text-muted-foreground">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
