import React, { useState } from 'react';

type Variant = {
    id: string;
    attributeValues: { id: string; value: string; attribute: { id: string; name: string } }[];
    price: number;
    stock: number;
};

type OrderItem = {
    variantId: string;
    quantity: number;
    price: number;
};

export default function ProductOrderForm({ productTitle, variants }: { productTitle: string; variants: Variant[] }) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedVariantId, setSelectedVariantId] = useState(
        variants && variants.length > 0 ? variants[0].id : ''
    );
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    async function handleOrder() {
        if (!customerName || !customerPhone || !address) {
            setMessage('Please fill in all customer details');
            return;
        }
        if (!variants || variants.length === 0) {
            setMessage('No product variants available');
            return;
        }
        if (!selectedVariantId) {
            setMessage('Please select a product variant');
            return;
        }
        if (quantity < 1) {
            setMessage('Quantity must be at least 1');
            return;
        }

        const variant = variants.find(v => v.id === selectedVariantId);
        if (!variant) {
            setMessage('Selected variant not found');
            return;
        }
        if (variant.stock < quantity) {
            setMessage('Not enough stock available');
            return;
        }
        const orderData = {
            customerName,
            customerPhone,
            address,
            items: [
                {
                    variantId: selectedVariantId,
                    quantity,
                    price: variant.price,
                },
            ] as OrderItem[],
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
            console.log('Posting order to:', `${apiUrl}/orders`);

            const res = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
                credentials: 'include',
            });

            const json = await res.json();


            if (res.ok) {
                setMessage(`Order created successfully! Order ID: ${json.orderId}`);
                // Optionally reset form here
            } else {
                setMessage(`Order failed: ${json.error || 'Unknown error'}`);
            }
        } catch (err) {
            setMessage('Network error, please try again.');
        }
    }


    return (
        <div style={{ maxWidth: 400, margin: 'auto' }}>
            <h2>Order: {productTitle}</h2>

            <label>
                Customer Name:
                <input value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </label>
            <br />

            <label>
                Customer Phone:
                <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            </label>
            <br />

            <label>
                Address:
                <textarea value={address} onChange={e => setAddress(e.target.value)} />
            </label>
            <br />

            <label>
                Variant:
                <select
                    value={selectedVariantId}
                    onChange={e => setSelectedVariantId(e.target.value)}
                >
                    {(variants || []).map(v => {
                        const attrText = v.attributeValues
                            .map(av => `${av.attribute.name}: ${av.value}`)
                            .join(', ');
                        return (
                            <option key={v.id} value={v.id}>
                                {attrText} - Price: {v.price} - Stock: {v.stock}
                            </option>
                        );
                    })}
                </select>

            </label>
            <br />

            <label>
                Quantity:
                <input
                    type="number"
                    min={1}
                    max={variants.find(v => v.id === selectedVariantId)?.stock || 1}
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                />
            </label>
            <br />

            <button onClick={handleOrder}>Buy Now</button>

            {message && <p>{message}</p>}
        </div>
    );
}
