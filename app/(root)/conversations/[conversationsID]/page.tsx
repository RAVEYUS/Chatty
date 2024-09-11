"use client";

import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'

type Props = {
  params: {
    conversationsID: Id<"conversations">;
  };
};

const ConversationPage = ({ params: { conversationsID } }: Props) => { 
  console.log("conversationId:", conversationsID);
  const conversation = useQuery(api.conversation.get, {id : conversationsID })

  return (
    conversation === undefined ? <div className='h-full w-full flex items-center justify-center'>
      <Loader2 className='h-8 w-8'/>
    </div> : conversation === null ? <p className='h-full w-full flex items-center justify-center'>
      Conversation not found
    </p> : <ConversationContainer>
      <Header name={(conversation.isGroup ? conversation.name : conversation.otherMember.username) || ""} imageUrl={(conversation.isGroup ? undefined : conversation.otherMember.imageurl)}/>
      <Body/>
      <ChatInput/>
    </ConversationContainer>
  )
}

export default ConversationPage