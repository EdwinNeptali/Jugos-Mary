import { useEffect, useState } from 'react';
import './CheckoutModal.css';
import OrderSummary from './OrderSummary';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const YAPE_NUMBER = '903031126';

export default function CheckoutModal({ cart, total, onClose }) {
  useBodyScrollLock(true);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    pago: 'yape',
    vuelto: '',
    yapeTelefono: '',
    yapeCodigo: ''
  });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isDigitsField = name === 'yapeTelefono' || name === 'yapeCodigo';
    const nextValue = isDigitsField ? value.replace(/\D/g, '') : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleCopyNumber = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(YAPE_NUMBER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => { /* clipboard unavailable, ignore */ });
  };

  const handleConfirm = () => {
    const nextErrors = {};
    if (!formData.nombre.trim()) nextErrors.nombre = 'Ingresa tu nombre completo.';
    if (!formData.direccion.trim()) nextErrors.direccion = 'Ingresa tu dirección de entrega.';

    if (formData.pago === 'yape') {
      if (!/^9\d{8}$/.test(formData.yapeTelefono)) {
        nextErrors.yapeTelefono = 'Número de 9 dígitos, empieza con 9.';
      }
      if (!/^\d{3,6}$/.test(formData.yapeCodigo)) {
        nextErrors.yapeCodigo = 'Código de 3 a 6 dígitos.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
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

    if (formData.pago === 'yape') {
      mensaje += `*Método de pago:* Yape/Plin\n`;
      mensaje += `*Pagó desde el número:* ${formData.yapeTelefono}\n`;
      mensaje += `*Código de aprobación:* ${formData.yapeCodigo}\n`;
      mensaje += `Ya realicé el Yape/Plin. Este es mi código de confirmación para verificar el pago.`;
    } else {
      mensaje += `*Método de pago:* Efectivo\n`;
      if (formData.vuelto) {
        mensaje += `*Paga con:* ${formData.vuelto}\n`;
      }
    }

    const encodedMessage = encodeURIComponent(mensaje);
    const phoneNumber = "51903031126";

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="dialog" aria-modal="true" aria-label="Finalizar pedido">
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
              className={errors.nombre ? 'has-error' : ''}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Dirección de Entrega</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej. Av. Principal 123"
              className={errors.direccion ? 'has-error' : ''}
            />
            {errors.direccion && <span className="field-error">{errors.direccion}</span>}
          </div>

          <OrderSummary cart={cart} total={total} />

          <div className="payment-method">
            <label className="payment-label">Método de Pago</label>
            <div className="payment-options">
              <label className={`radio-option ${formData.pago === 'yape' ? 'selected' : ''}`}>
                <input type="radio" name="pago" value="yape" checked={formData.pago === 'yape'} onChange={handleChange} />
                <span className="radio-option-icon">📲</span>
                <span>Yape / Plin</span>
              </label>
              <label className={`radio-option ${formData.pago === 'efectivo' ? 'selected' : ''}`}>
                <input type="radio" name="pago" value="efectivo" checked={formData.pago === 'efectivo'} onChange={handleChange} />
                <span className="radio-option-icon">💵</span>
                <span>Efectivo</span>
              </label>
            </div>

            {formData.pago === 'yape' && (
              <div className="yape-panel">
                <div className="yape-box">
                  <div className="yape-box-info">
                    <p>Yapea o Plinea a este número</p>
                    <div className="yape-number">{YAPE_NUMBER}</div>
                  </div>
                  <button type="button" className="copy-btn" onClick={handleCopyNumber}>
                    {copied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>

                <p className="yape-instructions">
                  Después de pagar, ingresa el número desde el que pagaste y el código de aprobación de tu comprobante para confirmar tu pedido. Así no necesitas compartir datos de tarjeta.
                </p>

                <div className="yape-confirm-fields">
                  <div className="form-group">
                    <label>Tu número Yape</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="yapeTelefono"
                      value={formData.yapeTelefono}
                      onChange={handleChange}
                      placeholder="9XXXXXXXX"
                      maxLength={9}
                      className={errors.yapeTelefono ? 'has-error' : ''}
                    />
                    {errors.yapeTelefono && <span className="field-error">{errors.yapeTelefono}</span>}
                  </div>

                  <div className="form-group">
                    <label>Código de aprobación</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="yapeCodigo"
                      value={formData.yapeCodigo}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={6}
                      className={errors.yapeCodigo ? 'has-error' : ''}
                    />
                    {errors.yapeCodigo && <span className="field-error">{errors.yapeCodigo}</span>}
                  </div>
                </div>
              </div>
            )}

            {formData.pago === 'efectivo' && (
              <div className="form-group">
                <label>¿Con cuánto pagas?</label>
                <input
                  type="text"
                  name="vuelto"
                  value={formData.vuelto}
                  onChange={handleChange}
                  placeholder="Ej: Pagaré con S/ 50"
                />
              </div>
            )}
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
