import { useState } from 'react';
import './CheckoutModal.css';

export default function CheckoutModal({ cart, total, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirm = () => {
    if (!formData.nombre || !formData.direccion) {
      alert("Por favor completa tu nombre y dirección para el envío.");
      return;
    }

    let mensaje = `*NUEVO PEDIDO - JUGOS & SÁNDWICHES*\n`;
    mensaje += `*Cliente:* ${formData.nombre}\n`;
    mensaje += `*Dirección:* ${formData.direccion}\n\n`;
    mensaje += `*📋 Detalle del pedido:*\n`;
    
    cart.forEach(item => {
      let extra = item.options?.hasBerenjena ? ' (+ Berenjena)' : '';
      mensaje += `▪ ${item.quantity}x ${item.title}${extra}: S/ ${(item.finalPrice * item.quantity).toFixed(2)}\n`;
    });

    mensaje += `\n*💰 TOTAL A PAGAR:* S/ ${total.toFixed(2)}\n\n`;
    mensaje += `*Método de pago:* Yape\n`;
    mensaje += `¡Hola! Aquí está mi pedido. Procederé a hacer el Yape al número indicado.`;

    const encodedMessage = encodeURIComponent(mensaje);
    const phoneNumber = "51903031126"; 
    
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose} aria-label="Cerrar">×</button>
        
        <div className="modal-header">
          <h2>Finalizar Pedido</h2>
          <p>Completa tus datos para coordinar la entrega.</p>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre}
              onChange={handleChange}
              placeholder="¿Quién recibe el pedido?"
            />
          </div>
          
          <div className="form-group">
            <label>Dirección de Entrega</label>
            <input 
              type="text" 
              name="direccion" 
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej. Av. Principal 123"
            />
          </div>

          <div className="payment-card">
            <div className="payment-info">
              <span className="payment-label">Total a pagar</span>
              <span className="payment-amount">S/ {total.toFixed(2)}</span>
            </div>
            <div className="yape-box">
               <p>Número Yape / Plin</p>
               <div className="yape-number">903031126</div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
