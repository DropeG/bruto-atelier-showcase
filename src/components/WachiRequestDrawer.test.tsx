import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WachiRequestDrawer, { type WachiRequestPiece } from './WachiRequestDrawer';

const mesaPiece: WachiRequestPiece = {
  name: 'Mesa',
  description: 'Cubierta de bordes orgánicos sobre dos apoyos escultóricos en lenga.',
  image: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png',
  kind: 'table',
  price: '$3.290.000',
  sizes: [
    'Largo entre 140-156 cm Ancho entre 80-120 cm',
    'Largo entre 157-189 cm Ancho entre 80-120 cm',
    'Largo entre 190-220 cm Ancho entre 80-120 cm',
  ],
};

describe('WachiRequestDrawer (2-Column Yeezy Structure)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('validates required contact and shipping fields in Spanish before calling the API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(
      <WachiRequestDrawer
        open
        onOpenChange={vi.fn()}
        piece={mesaPiece}
        selectedSize={mesaPiece.sizes![0]}
        onSelectSize={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'SOLICITAR PIEZA A MEDIDA' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Ingresa un correo electrónico válido.');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('updates quantity with + / - controls and submits the draft order request', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ok: true,
          status: 200,
          draftOrder: {
            id: 'gid://shopify/DraftOrder/123',
            name: '#D42',
            invoiceUrl: null,
            status: 'OPEN',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(
      <WachiRequestDrawer
        open
        onOpenChange={vi.fn()}
        piece={mesaPiece}
        selectedSize={mesaPiece.sizes![1]}
        onSelectSize={vi.fn()}
      />,
    );

    // Select Architect/Designer profile (The Future Perfect style)
    fireEvent.click(screen.getByRole('radio', { name: 'ARQUITECTO / DISEÑADOR' }));

    // Increase quantity from 1 to 2 using the + button in RESUMEN DE SOLICITUD
    fireEvent.click(screen.getByRole('button', { name: /Aumentar cantidad de Mesa/i }));
    expect(screen.getByText('2')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), {
      target: { value: 'antonia@estudio.cl' },
    });
    fireEvent.change(screen.getByLabelText('TELÉFONO'), {
      target: { value: '+56 9 1234 5678' },
    });
    fireEvent.change(screen.getByLabelText('NOMBRE'), {
      target: { value: 'Antonia' },
    });
    fireEvent.change(screen.getByLabelText('APELLIDO'), {
      target: { value: 'Valdivia' },
    });
    fireEvent.change(screen.getByLabelText('DIRECCIÓN'), {
      target: { value: 'Av. Nueva Costanera 3800' },
    });
    fireEvent.change(screen.getByLabelText('CIUDAD / COMUNA'), {
      target: { value: 'Vitacura' },
    });
    fireEvent.change(screen.getByLabelText('COMENTARIOS / MEDIDAS EXACTAS (OPCIONAL)'), {
      target: { value: 'Largo ideal 175 cm' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'SOLICITAR PIEZA A MEDIDA' }));

    await waitFor(() => {
      expect(screen.getByText('Solicitud recibida')).toBeTruthy();
    });
    expect(screen.getByText(/PEDIDO PRELIMINAR #D42/i)).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/wachi-draft-order',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"clientProfile":"ARQUITECTO / DISEÑADOR"'),
      }),
    );
  });
});
