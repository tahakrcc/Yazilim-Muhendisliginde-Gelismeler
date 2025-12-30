import { useState } from 'react'
import './AddProductModal.css'

interface AddProductModalProps {
    marketId: string
    position: { x: number, y: number, z: number }
    onClose: () => void
    onSuccess: () => void
}

export default function AddProductModal({ marketId, position, onClose, onSuccess }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sebze',
        price: '',
        unit: 'kg',
        vendorName: '',
        freshness: 'Taze'
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // In a real app we'd use a service, but for speed adding direct call or using a new sellerService
            // Using direct axios for now based on finding API_BASE_URL logic or just hardcoding relative path 
            // since vite proxy might handle it or we use apiClient.
            // Let's assume we import apiClient from services/api

            // Construct payload matching SellerController
            const payload = {
                marketId,
                productData: {
                    name: formData.name,
                    category: formData.category,
                    unit: formData.unit,
                    freshness: formData.freshness
                },
                position,
                vendorName: formData.vendorName,
                price: formData.price
            }

            // We need to use the apiClient to ensure headers are sent
            const apiClient = (await import('../../services/api')).default
            await apiClient.post('/seller/stall/claim', payload)

            alert('Tezgah başarıyla kiralandı ve ürün eklendi!')
            onSuccess()
        } catch (error) {
            console.error('Hata:', error)
            alert('İşlem başarısız oldu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content add-product-modal">
                <div className="modal-header">
                    <h3>📍 Yeni Tezgah Aç: {position.x}, {position.y}</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Satıcı/Tezgah Adı:</label>
                        <input
                            type="text"
                            value={formData.vendorName}
                            onChange={e => setFormData({ ...formData, vendorName: e.target.value })}
                            placeholder="Örn: Ali Baba Çiftliği"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ürün Adı:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Örn: Domates"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Kategori:</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Sebze">Sebze</option>
                                <option value="Meyve">Meyve</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Birim:</label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="kg"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Fiyat (TL):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'İşleniyor...' : 'Satışa Başla 🚀'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
