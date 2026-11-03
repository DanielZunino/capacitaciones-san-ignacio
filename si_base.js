// ===== Grupo San Ignacio · base común (se carga después de mejoras_comunes.js y antes de las charlas) =====
// 1) Empresa de la persona que ingresó: window.SI_EMP = 'lacteos' | 'agroex' | 'agricola' | 'inversiones'
// 2) Vestimenta de los dibujos según la empresa (W): nadie usa casco salvo que el dibujo lo pida.
//    Lácteos y Agroex: cofia, ropa y botas blancas. Agrícola: legionario, manga larga y guantes. Inversiones: camisa, sin casco.
// 3) Textos por empresa: [[L:texto lácteos|X:texto packing|A:texto campo|I:texto oficina]] se reemplaza por el de la empresa.
(function () {
  if (window.__siBase) return; window.__siBase = true;
  window.SI_EMP = window.SI_EMP || 'lacteos';
  // Vestimenta real (Daniel, 03-11-2026): Lácteos = cotona blanca, pechera blanca, cofia, mascarilla, guantes de nitrilo amarillos y botas blancas de seguridad.
  // Agroex = cotona verde o azul, cofia, mascarilla y zapatos de seguridad. Agrícola = overol con su EPP para radiación UV (legionario, lentes).
  const VEST = {
    lacteos: { helmet: false, cofia: true, mask: true, shirt: '#FFFFFF', pants: '#ECEFF1', boots: '#FAFAFA', apron: '#FFFFFF', gloves: '#FDD835' },
    agroex: { helmet: false, cofia: true, mask: true, shirt: '#2E7D32', pants: '#37474F', gloves: false },
    agricola: { helmet: false, hat: 'legion', glasses: true, shirt: '#1F3A6B', pants: '#1F3A6B', gloves: '#8D6E63' },
    inversiones: { helmet: false, shirt: '#90CAF9', pants: '#37474F' }
  };
  window.SI_VEST = VEST;
  if (typeof W === 'function' && !W.__si) {
    const W0 = W;
    W = function (x, y, o) {
      o = Object.assign({}, o || {});
      const v = VEST[o.emp || window.SI_EMP] || VEST.lacteos;
      Object.keys(v).forEach(k => { if (o[k] === undefined) o[k] = v[k]; });
      if ((o.emp || window.SI_EMP) === 'agroex' && v.shirt === o.shirt && Math.round(x / 40) % 2) o.shirt = '#1565C0';
      if (o.helmet === true) o.helmet = '#FFC20E';
      if (o.cofia && o.helmet) o.cofia = false;
      let g = W0(x, y, Object.assign({}, o, { anim: undefined }));
      if (o.hat === 'legion' && !o.helmet) {   // gorro legionario: visera y paño que cubre la nuca
        const P = POSES[o.pose || 'stand'], s = o.s || 1, fx = o.flip ? -1 : 1, X = x + P.head[0] * s * fx, Y = y + P.head[1] * s;
        g += `<path d="M${X - 10.6 * s},${Y - 2 * s} Q${X - 11 * s},${Y - 14.5 * s} ${X},${Y - 14 * s} Q${X + 11 * s},${Y - 14.5 * s} ${X + 10.6 * s},${Y - 2 * s} Z" fill="${o.hatColor || '#F1E3C2'}" stroke="#22303A" stroke-width="${1 * s}"/>`
          + `<path d="M${X + 9 * s * fx},${Y - 3 * s} q${8 * s * fx},${-.5 * s} ${9 * s * fx},${2.4 * s} l${-9.5 * s * fx},${.4 * s} z" fill="${o.hatColor || '#F1E3C2'}" stroke="#22303A" stroke-width="${.9 * s}"/>`
          + `<path d="M${X - 10 * s * fx},${Y - 3 * s} q${-3 * s * fx},${9 * s} ${-1 * s * fx},${15 * s} l${6 * s * fx},${-1 * s} q${-2 * s * fx},${-6 * s} ${1 * s * fx},${-13 * s} z" fill="${o.hatColor || '#F1E3C2'}" stroke="#22303A" stroke-width="${.8 * s}"/>`;
      }
      return o.anim ? `<g class="${o.anim}">${g}</g>` : g;
    };
    W.__si = true;
  }
  // [[L:..|X:..|A:..|I:..]] -> texto de la empresa
  const LET = { lacteos: 'L', agroex: 'X', agricola: 'A', inversiones: 'I' };
  window.siTxt = function (s, emp) {
    if (typeof s !== 'string' || s.indexOf('[[') < 0) return s;
    const L = LET[emp || window.SI_EMP] || 'L';
    return s.replace(/\[\[([\s\S]*?)\]\]/g, (m, body) => {
      const parts = {}; body.split('|').forEach(p => { const k = p.match(/^\s*([LXAI]):([\s\S]*)$/); if (k) parts[k[1]] = k[2]; });
      return parts[L] !== undefined ? parts[L] : (parts.L || '');
    });
  };
})();
