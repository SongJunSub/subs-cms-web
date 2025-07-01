import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';

// Reservation 타입
type Reservation = {
  id: number;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: number;
};

// Reservation Context
const ReservationContext = createContext<{reservations: Reservation[]; reload: () => void}>({reservations: [], reload: () => {}});

export function useReservations() {
  return useContext(ReservationContext);
}

export function ReservationProvider({children}: {children: React.ReactNode}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const reload = () => {
    axios.get('http://localhost:8080/api/reservations').then(res => setReservations(res.data));
  };
  useEffect(reload, []);
  return (
    <ReservationContext.Provider value={{reservations, reload}}>{children}</ReservationContext.Provider>
  );
}

export function ReservationList() {
  const {reservations, reload} = useReservations();
  return (
    <div>
      <h2>예약 리스트</h2>
      <button onClick={reload}>새로고침</button>
      <ul>
        {reservations.map(r => (
          <li key={r.id}>{r.guestName} ({r.guestEmail}) - {r.checkInDate}~{r.checkOutDate} - Room {r.roomId}</li>
        ))}
      </ul>
    </div>
  );
}

export function ReservationForm() {
  const {reload} = useReservations();
  const [form, setForm] = useState<Omit<Reservation, 'id'>>({guestName: '', guestEmail: '', checkInDate: '', checkOutDate: '', roomId: 0});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/reservations', form).then(() => { reload(); setForm({guestName: '', guestEmail: '', checkInDate: '', checkOutDate: '', roomId: 0}); });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>예약 등록</h3>
      <input name='guestName' value={form.guestName} onChange={handleChange} placeholder='이름' required />
      <input name='guestEmail' value={form.guestEmail} onChange={handleChange} placeholder='이메일' required />
      <input name='checkInDate' value={form.checkInDate} onChange={handleChange} placeholder='체크인(YYYY-MM-DD)' required />
      <input name='checkOutDate' value={form.checkOutDate} onChange={handleChange} placeholder='체크아웃(YYYY-MM-DD)' required />
      <input name='roomId' type='number' value={form.roomId} onChange={handleChange} placeholder='객실ID' required />
      <button type='submit'>등록</button>
    </form>
  );
}

