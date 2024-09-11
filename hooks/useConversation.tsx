import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
    const params = useParams();
    const conversationId = useMemo(() => params.conversationsID || "", [params]);


    // Check if you're on the main /conversations page or a specific conversation
    const isActive = useMemo(() => !!conversationId, [conversationId]);

    return {
        isActive,
        conversationId,
    };
};
