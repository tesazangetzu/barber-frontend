interface IService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

interface IBarber {
  email: string;
  id: number;
  is_active: boolean;
  name: string;
  phone: string;
}
