import { Market } from '../types';

export const MOCK_MARKETS: Market[] = [
    {
        id: 'm1',
        name: 'Beşiktaş Cumartesi Pazarı',
        address: 'Türkali, Nüzhetiye Cd., 34357 Beşiktaş/İstanbul',
        latitude: 41.045,
        longitude: 29.002,
        isOpenToday: true,
        openingHours: '08:00 - 19:00',
        imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm2',
        name: 'Kadıköy Salı Pazarı',
        address: 'Hasanpaşa, Uzunçayır Cd. No:30, 34722 Kadıköy/İstanbul',
        latitude: 40.999,
        longitude: 29.045,
        isOpenToday: false,
        openingHours: '07:00 - 20:00 (Sadece Salı)',
        imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm3',
        name: 'Feriköy Organik Pazar',
        address: 'Cumhuriyet, Bomonti, Şişli/İstanbul',
        latitude: 41.057,
        longitude: 28.983,
        isOpenToday: true,
        openingHours: '09:00 - 18:00',
        imageUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm4',
        name: 'Yeşilköy Çarşamba Pazarı',
        address: 'Yeşilköy, Bakırköy/İstanbul',
        latitude: 40.963,
        longitude: 28.834,
        isOpenToday: false,
        openingHours: '08:00 - 19:30',
        imageUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm5',
        name: 'Ulus Pazarı (Ortaköy)',
        address: 'Levazım, Beşiktaş/İstanbul',
        latitude: 41.060,
        longitude: 29.020,
        isOpenToday: false,
        openingHours: '08:30 - 19:00',
        imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=600&auto=format&fit=crop'
    }
];
