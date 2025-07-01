import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Room = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  description: string;
};

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    axios.get('http://localhost:8080/api/rooms')
      .then(res => setRooms(res.data))
      .catch(() => setRooms([]));
  }, []);
  return (
    <div>
      <h2>객실 리스트 (API 연동)</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.name} - {room.capacity}인실 - {room.price.toLocaleString()}원</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;

