"use client"
import ItemList from '@/components/shared/item-list/itemList'
import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import DMConversationItem from './_components/DMConversationItem'

type Props = React.PropsWithChildren<{}>

const Conversationslayout = ({children}: Props) => {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
     <ItemList title="Conversations">
     {conversations ? ( conversations.length === 0 ? ( 
      <p className='w-full h-full flex items-center justify-center'>
        No conversations found
      </p>
    ) 
      : conversations.map(conversations => {
        return conversations.conversation.isGroup ? null: (<DMConversationItem key={conversations.conversation._id} id={conversations.conversation._id} username={conversations.otherMember?.username || ""} imageUrl={conversations.otherMember?.imageurl || ""} lastMessageContent={conversations.lastmessage?.content} lastMessageSender={conversations.lastmessage?.sender}/>)
      }) 
    ) : (<Loader2/>)}
     </ItemList>
     {children}
    </>
  )
}

export default Conversationslayout