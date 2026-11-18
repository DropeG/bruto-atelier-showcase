import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WachiRequestDrawer, { type WachiRequestPiece } from './WachiRequestDrawer';

const mesaPiece: WachiRequestPiece = {
  name: 'Mesa',
  description: 'Mesa en lenga patagónica maciza a medida, terminación en aceite-cera inocuo.',
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

  it('validates required contact fields in Spanish before calling the API', async () => {
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

    expect(screen.queryByText('PERFIL DEL SOLICITANTE')).toBeNull();
    expect(screen.queryByText('DIRECCIÓN DE DESPACHO')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'SOLICITAR PIEZA A MEDIDA' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Ingresa tu nombre.');
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

    // Increase quantity from 1 to 2 using the + button in RESUMEN DE SOLICITUD
    fireEvent.click(screen.getByRole('button', { name: /Aumentar cantidad de Mesa/i }));
    expect(screen.getByText('2')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('NOMBRE'), {
      target: { value: 'Antonia' },
    });
    fireEvent.change(screen.getByLabelText('APELLIDO'), {
      target: { value: 'Valdivia' },
    });
    fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), {
      target: { value: 'antonia@estudio.cl' },
    });
    fireEvent.change(screen.getByLabelText('TELÉFONO'), {
      target: { value: '+56 9 1234 5678' },
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
        body: expect.stringContaining('"customerEmail":"antonia@estudio.cl"'),
      }),
    );
  });
});
