import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../components/ChatRoom";



async function getRoomBySlug(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  return response.data.room.id;
}

const ChatRoomMain = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const roomId = await getRoomBySlug(slug);
  return (
    <div>
      <ChatRoom id={roomId} />
    </div>
  )
};

export default ChatRoomMain;
