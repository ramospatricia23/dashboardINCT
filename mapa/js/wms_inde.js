/* Camadas externas no mapa: WMS da INDE (carregamento sob demanda) e arquivos locais
   (KML, KMZ, Shapefile, GeoPackage, GeoJSON), com painel para administrar o que foi adicionado.
   Depende de: map (global), Leaflet e do container do painel passado a montarPainelINDE().
   Bibliotecas auxiliares (shpjs, JSZip, togeojson, proj4, sql.js) são carregadas por CDN só quando o formato é usado. */

var AGENCIAS_WMS = [
    { sigla: 'ANA', nome: 'Agência Nacional de Águas e Saneamento Básico', url: 'https://www.snirh.gov.br/arcgis/services/INDE/Camadas/MapServer/WMSServer' },
    { sigla: 'ANATEL', nome: 'Agência Nacional de Telecomunicações', url: 'https://sistemas.anatel.gov.br/geoserver/ows' },
    { sigla: 'ANM', nome: 'Agência Nacional de Mineração', url: 'https://geoservicos.inde.gov.br/geoserver/ANM/ows' },
    { sigla: 'ANP', nome: 'Agência Nacional do Petróleo, Gás Natural e Biocombustíveis', url: 'https://gishub.anp.gov.br/geoserver/ows' },
    { sigla: 'ANTT', nome: 'Agência Nacional de Transporte Terrestres', url: 'https://geoservicos.inde.gov.br/geoserver/ANTT/ows' },
    { sigla: 'BNDES', nome: 'Banco Nacional de Desenvolvimento Econômico e Social', url: 'https://geoservicos.inde.gov.br/geoserver/BNDES/ows' },
    { sigla: 'Censipam', nome: 'Centro Gestor e Operacional do Sistema de Proteção da Amazônia', url: 'https://panorama.sipam.gov.br/geoserver/publico/ows' },
    { sigla: 'CPRM', nome: 'Serviço Geológico do Brasil', url: 'https://geoservicos.sgb.gov.br/geoserver/geologia/ows/' },
    { sigla: 'DNIT', nome: 'Departamento Nacional de Infraestrutura de Transportes', url: 'https://geoservicos.inde.gov.br/geoserver/DNIT/ows' },
    { sigla: 'EB/DSG', nome: 'Diretoria de Serviço Geográfico do Exército Brasileiro', url: 'https://bdgex.eb.mil.br/mapcache3857' },
    { sigla: 'EMBRAPA', nome: 'Empresa Brasileira de Pesquisa Agropecuária', url: 'https://geoinfo.dados.embrapa.br/geoserver/ows' },
    { sigla: 'EPE', nome: 'Empresa de Pesquisa Energética', url: 'https://geoservicos.inde.gov.br/geoserver/EPE/ows' },
    { sigla: 'FAB/COMAE', nome: 'Comando de Operações Aeroespaciais', url: 'https://geoservicos.inde.gov.br/geoserver/COMAE/ows' },
    { sigla: 'FUNAI', nome: 'Fundação Nacional dos Povos Indígenas', url: 'https://geoserver.funai.gov.br/geoserver/ows' },
    { sigla: 'FUNAI/CMR', nome: 'Centro de Monitoramento Remoto da Funai', url: 'https://cmr.funai.gov.br/geoserver/ows' },
    { sigla: 'IBAMA', nome: 'Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis', url: 'https://pamgia.ibama.gov.br/server/services/SISCOM/publico/MapServer/WMSServer' },
    // IBGE: URL não informada, adicionar aqui quando tiver.
    { sigla: 'IBGE/ODS', nome: 'Objetivos de Desenvolvimento Sustentável', url: 'https://geoservicos.ibge.gov.br/geoserver/ODS/ows' },
    { sigla: 'ICA', nome: 'Instituto de Cartografia Aeronáutica', url: 'https://geoaisweb.decea.gov.br/geoserver/ICA/ows' },
    { sigla: 'ICMBio', nome: 'Instituto Chico Mendes de Conservação da Biodiversidade', url: 'https://geoservicos.inde.gov.br/geoserver/ICMBio/ows' },
    { sigla: 'INPE', nome: 'Instituto Nacional de Pesquisas Espaciais', url: 'https://terrabrasilis.dpi.inpe.br/geoserver/ows' },
    { sigla: 'IPHAN', nome: 'Instituto do Patrimônio Histórico e Artístico Nacional', url: 'https://geoserver.iphan.gov.br/geoserver/ows' },
    { sigla: 'MAPA', nome: 'Ministério da Agricultura e Pecuária', url: 'https://geoservicos.inde.gov.br/geoserver/MAPA/ows' },
    { sigla: 'MB/COMPAAz', nome: 'Comando de Operações Marítimas e Proteção da Amazônia Azul', url: 'https://geoservicos.inde.gov.br/geoserver/COMPAAz/ows' },
    { sigla: 'MB/DHN', nome: 'Diretoria de Hidrografia e Navegação', url: 'https://idem.marinha.mil.br/geoserver/ows' },
    { sigla: 'MB/DPC', nome: 'Diretoria de Portos e Costas', url: 'https://geoservicos.inde.gov.br/geoserver/DPC/ows' },
    { sigla: 'MB/DPHDM', nome: 'Diretoria do Patrimônio Histórico e Documentação da Marinha', url: 'https://geoservicos.inde.gov.br/geoserver/DPHDM/ows' },
    { sigla: 'MB/PEM', nome: 'Planejamento Espacial Marinho', url: 'https://geoservicos.inde.gov.br/geoserver/PEM/ows' },
    { sigla: 'MDIC', nome: 'Ministério do Desenvolvimento, Indústria, Comércio e Serviços', url: 'https://geoservicos.inde.gov.br/geoserver/MDIC/ows' },
    { sigla: 'MDR/SEDEC', nome: 'Secretaria Nacional de Proteção e Defesa Civil', url: 'https://geoserver.mdr.gov.br/geoserver/ows' },
    { sigla: 'MMA', nome: 'Ministério do Meio Ambiente e Mudança do Clima', url: 'https://geoservicos.inde.gov.br/geoserver/MMA/ows' },
    { sigla: 'MP', nome: 'Ministério do Planejamento e Orçamento', url: 'https://geoservicos.inde.gov.br/geoserver/MPOG/ows' },
    { sigla: 'MPA', nome: 'Ministério de Pesca e Aquicultura', url: 'https://geoservicos.inde.gov.br/geoserver/MPA/ows' },
    { sigla: 'MS/IDE-MS', nome: 'Ministério da Saúde', url: 'https://ide.saude.gov.br/geoserver/ows' },
    { sigla: 'MTR', nome: 'Ministério dos Transportes', url: 'https://geoservicos.inde.gov.br/geoserver/MInfra/ows' },
    { sigla: 'MTUR', nome: 'Ministério do Turismo', url: 'https://geoservicos.inde.gov.br/geoserver/MTU/ows' },
    { sigla: 'PGGM', nome: 'Programa de Geologia e Geofísica Marinha', url: 'https://geoservicos.inde.gov.br/geoserver/PGGM/ows' },
    { sigla: 'SFB', nome: 'Serviço Florestal do Brasil', url: 'https://sistemas.florestal.gov.br/geoserver/ows' },
    { sigla: 'SPM', nome: 'Secretaria de Políticas para as Mulheres', url: 'https://geoservicos.inde.gov.br/geoserver/SPM/ows' },
    { sigla: 'SPU', nome: 'Secretaria de Patrimônio da União', url: 'https://geoservicos.inde.gov.br/geoserver/SPU/ows' },
    { sigla: 'VALEC', nome: 'Engenharia, Construções e Ferrovias S.A.', url: 'https://geoservicos.inde.gov.br/geoserver/VALEC/ows' }
];

map.createPane('pane_wms');
map.getPane('pane_wms').style.zIndex = 402;
map.createPane('pane_usuario');
map.getPane('pane_usuario').style.zIndex = 450;

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ===== Registro das camadas adicionadas pelo usuário (WMS e arquivos) ===== */
var camadasUsuario = [];   // todas as camadas adicionadas, da mais antiga para a mais nova
var wmsAtivas = {};        // chave url|camada -> entrada WMS visível (usado pela legenda)
var arquivosAtivos = {};   // id -> entrada de arquivo visível (usado pela legenda)
var contadorCamadas = 0;
var PALETA = ['#E4572E', '#17BEBB', '#FFC914', '#76B041', '#7B2CBF', '#2E86AB', '#D1495B', '#F28F3B'];
var idxCor = 0;

function filhosLayer(el) {
    return Array.prototype.filter.call(el.children, function (c) { return c.localName === 'Layer'; });
}

function textoFilho(el, tag) {
    for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].localName === tag) return el.children[i].textContent;
    }
    return '';
}

function lerBBox(el) {
    for (var i = 0; i < el.children.length; i++) {
        var c = el.children[i];
        if (c.localName !== 'EX_GeographicBoundingBox') continue;
        var v = {};
        for (var j = 0; j < c.children.length; j++) v[c.children[j].localName] = parseFloat(c.children[j].textContent);
        var n = [v.southBoundLatitude, v.westBoundLongitude, v.northBoundLatitude, v.eastBoundLongitude];
        if (n.every(isFinite)) return L.latLngBounds([[n[0], n[1]], [n[2], n[3]]]);
    }
    return null;
}

/* Achata a árvore de Layers do GetCapabilities numa lista de camadas */
function coletarCamadas(el, grupo, saida, bboxPai) {
    var nome = textoFilho(el, 'Name');
    var titulo = textoFilho(el, 'Title') || nome;
    var bbox = lerBBox(el) || bboxPai || null;
    var filhos = filhosLayer(el);
    if (nome) saida.push({ nome: nome, titulo: titulo, grupo: grupo, bbox: bbox });
    var proximo = filhos.length && !nome ? (grupo ? grupo + ' › ' : '') + titulo : grupo;
    filhos.forEach(function (f) { coletarCamadas(f, proximo, saida, bbox); });
    return saida;
}

/* ===== Bibliotecas carregadas só quando necessárias ===== */
var LIBS = {
    shp: {
        test: function () { return window.shp; },
        urls: ['https://cdn.jsdelivr.net/npm/shpjs@4.0.4/dist/shp.min.js', 'https://unpkg.com/shpjs@4.0.4/dist/shp.min.js']
    },
    jszip: {
        test: function () { return window.JSZip; },
        urls: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js']
    },
    togeojson: {
        test: function () { return window.toGeoJSON; },
        urls: ['https://cdn.jsdelivr.net/npm/@tmcw/togeojson@5.8.1/dist/togeojson.umd.js', 'https://unpkg.com/@tmcw/togeojson@5.8.1/dist/togeojson.umd.js']
    },
    proj4: {
        test: function () { return window.proj4; },
        urls: ['https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.2/proj4.js', 'https://cdn.jsdelivr.net/npm/proj4@2.9.2/dist/proj4.js']
    },
    sqljs: {
        test: function () { return typeof window.initSqlJs === 'function'; },
        urls: ['https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js', 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js']
    }
};

function injetarScript(url) {
    return new Promise(function (ok, erro) {
        var s = document.createElement('script');
        s.src = url;
        s.onload = ok;
        s.onerror = function () { s.remove(); erro(new Error('falha ao carregar ' + url)); };
        document.head.appendChild(s);
    });
}

function carregarLib(nome) {
    var lib = LIBS[nome];
    if (lib.test()) return Promise.resolve();
    if (lib.promessa) return lib.promessa;
    lib.promessa = lib.urls.reduce(function (p, u) {
        return p.catch(function () {
            return injetarScript(u).then(function () {
                if (!lib.test()) throw new Error('biblioteca indisponível');
                lib.base = u.replace(/[^\/]*$/, '');
            });
        });
    }, Promise.reject()).catch(function () {
        lib.promessa = null;
        throw new Error('não foi possível carregar a biblioteca "' + nome + '" (verifique a conexão com a internet)');
    });
    return lib.promessa;
}

/* ===== Leitura de arquivos ===== */
function lerBuffer(f) {
    return new Promise(function (ok, erro) {
        var r = new FileReader();
        r.onload = function () { ok(r.result); };
        r.onerror = function () { erro(new Error('falha ao ler ' + f.name)); };
        r.readAsArrayBuffer(f);
    });
}

function lerTexto(f) {
    return new Promise(function (ok, erro) {
        var r = new FileReader();
        r.onload = function () { ok(r.result); };
        r.onerror = function () { erro(new Error('falha ao ler ' + f.name)); };
        r.readAsText(f);
    });
}

function extensao(n) { var m = /\.([^.]+)$/.exec(n); return m ? m[1].toLowerCase() : ''; }
function baseNome(n) { return n.replace(/\.[^.]+$/, ''); }

function normalizarGeoJSON(o) {
    if (!o || !o.type) throw new Error('GeoJSON inválido');
    if (o.type === 'FeatureCollection') return o;
    if (o.type === 'Feature') return { type: 'FeatureCollection', features: [o] };
    return { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: o }] };
}

function kmlParaGeoJSON(texto) {
    var doc = new DOMParser().parseFromString(texto, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('KML inválido');
    return toGeoJSON.kml(doc);
}

/* ----- GeoPackage: leitura via sql.js + conversão WKB -> GeoJSON ----- */
function criarTransformacao(srsId, definicao) {
    if ([0, 4326, 4674, 4258, 4269, 4979].indexOf(srsId) !== -1) return function (p) { return p; };
    if (srsId === 3857 || srsId === 900913) {
        return function (p) {
            return [p[0] / 6378137 * 180 / Math.PI,
                (2 * Math.atan(Math.exp(p[1] / 6378137)) - Math.PI / 2) * 180 / Math.PI];
        };
    }
    try {
        var conv = proj4(definicao, 'EPSG:4326');
        conv.forward([0, 0]);
        return function (p) { return conv.forward([p[0], p[1]]); };
    } catch (e) {
        throw new Error('sistema de coordenadas não suportado (EPSG:' + srsId + ')');
    }
}

function lerWKB(dv, c, tf) {
    var le = dv.getUint8(c.o) === 1; c.o += 1;
    var t = dv.getUint32(c.o, le); c.o += 4;
    var temZ = !!(t & 0x80000000), temM = !!(t & 0x40000000);
    t = t & 0x0FFFFFFF;
    if (t >= 1000) {
        var k = Math.floor(t / 1000);
        if (k === 1 || k === 3) temZ = true;
        if (k === 2 || k === 3) temM = true;
        t = t % 1000;
    }
    var dim = 2 + (temZ ? 1 : 0) + (temM ? 1 : 0);

    function ponto() {
        var x = dv.getFloat64(c.o, le), y = dv.getFloat64(c.o + 8, le);
        c.o += dim * 8;
        return (isNaN(x) || isNaN(y)) ? null : tf([x, y]);
    }
    function pontos() {
        var n = dv.getUint32(c.o, le); c.o += 4;
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(ponto());
        return arr;
    }
    function aneis() {
        var n = dv.getUint32(c.o, le); c.o += 4;
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(pontos());
        return arr;
    }
    function filhas() {
        var n = dv.getUint32(c.o, le); c.o += 4;
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(lerWKB(dv, c, tf));
        return arr;
    }

    switch (t) {
        case 1: var p = ponto(); return p ? { type: 'Point', coordinates: p } : null;
        case 2: return { type: 'LineString', coordinates: pontos() };
        case 3: return { type: 'Polygon', coordinates: aneis() };
        case 4: return { type: 'MultiPoint', coordinates: filhas().filter(Boolean).map(function (g) { return g.coordinates; }) };
        case 5: return { type: 'MultiLineString', coordinates: filhas().map(function (g) { return g.coordinates; }) };
        case 6: return { type: 'MultiPolygon', coordinates: filhas().map(function (g) { return g.coordinates; }) };
        case 7: return { type: 'GeometryCollection', geometries: filhas().filter(Boolean) };
        default: throw new Error('tipo de geometria não suportado (' + t + ')');
    }
}

function geometriaGpkg(blob, tf) {
    if (!blob || blob.length < 8 || blob[0] !== 0x47 || blob[1] !== 0x50) return null;
    var dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
    var flags = blob[3];
    if ((flags >> 4) & 1) return null;                       // geometria vazia
    var env = [0, 32, 48, 48, 64][(flags >> 1) & 7] || 0;
    return lerWKB(dv, { o: 8 + env }, tf);
}

async function lerGpkg(f, nome) {
    await carregarLib('sqljs');
    await carregarLib('proj4');
    var SQL = await window.initSqlJs({ locateFile: function (a) { return LIBS.sqljs.base + a; } });
    var db = new SQL.Database(new Uint8Array(await lerBuffer(f)));
    var saida = [];
    try {
        var r = db.exec("SELECT c.table_name, c.identifier, g.column_name, c.srs_id " +
            "FROM gpkg_contents c JOIN gpkg_geometry_columns g ON g.table_name = c.table_name " +
            "WHERE c.data_type = 'features'");
        if (!r.length) throw new Error('nenhuma tabela de feições no GeoPackage');
        r[0].values.forEach(function (t) {
            var tabela = t[0], ident = t[1], colGeom = t[2], srs = t[3];
            var def = db.exec('SELECT definition FROM gpkg_spatial_ref_system WHERE srs_id = ' + (+srs));
            var tf = criarTransformacao(srs, def.length ? def[0].values[0][0] : '');
            var stmt = db.prepare('SELECT * FROM "' + tabela.replace(/"/g, '""') + '"');
            var feats = [];
            while (stmt.step()) {
                var row = stmt.getAsObject();
                var g = geometriaGpkg(row[colGeom], tf);
                delete row[colGeom];
                Object.keys(row).forEach(function (k) {
                    if (row[k] instanceof Uint8Array) delete row[k];
                });
                if (g) feats.push({ type: 'Feature', properties: row, geometry: g });
            }
            stmt.free();
            saida.push({
                titulo: r[0].values.length > 1 ? nome + ' › ' + (ident || tabela) : nome,
                gj: { type: 'FeatureCollection', features: feats },
                formato: 'GeoPackage'
            });
        });
    } finally {
        db.close();
    }
    return saida;
}

/* Converte um arquivo em uma ou mais camadas GeoJSON: [{titulo, gj, formato}] */
async function converterArquivo(f) {
    var ext = extensao(f.name), nome = baseNome(f.name);

    if (ext === 'geojson' || ext === 'json') {
        return [{ titulo: nome, gj: normalizarGeoJSON(JSON.parse(await lerTexto(f))), formato: 'GeoJSON' }];
    }
    if (ext === 'kml') {
        await carregarLib('togeojson');
        return [{ titulo: nome, gj: kmlParaGeoJSON(await lerTexto(f)), formato: 'KML' }];
    }
    if (ext === 'kmz') {
        await carregarLib('jszip');
        await carregarLib('togeojson');
        var zip = await JSZip.loadAsync(await lerBuffer(f));
        var kmls = Object.keys(zip.files).filter(function (n) { return /\.kml$/i.test(n) && !zip.files[n].dir; });
        if (!kmls.length) throw new Error('o KMZ não contém arquivo KML');
        var res = [];
        for (var i = 0; i < kmls.length; i++) {
            var txt = await zip.files[kmls[i]].async('string');
            res.push({
                titulo: kmls.length > 1 ? nome + ' › ' + baseNome(kmls[i].split('/').pop()) : nome,
                gj: kmlParaGeoJSON(txt), formato: 'KMZ'
            });
        }
        return res;
    }
    if (ext === 'zip') {
        await carregarLib('shp');
        var r = await shp(await lerBuffer(f));
        var lista = Array.isArray(r) ? r : [r];
        return lista.map(function (fc) {
            return {
                titulo: lista.length > 1 ? nome + ' › ' + (fc.fileName || 'camada') : nome,
                gj: fc, formato: 'Shapefile'
            };
        });
    }
    if (ext === 'gpkg') return lerGpkg(f, nome);
    throw new Error('formato ".' + ext + '" não suportado');
}

/* Shapefile enviado solto: .shp + .dbf (+ .prj, .cpg) */
async function converterShapefileSolto(g) {
    await carregarLib('shp');
    var prj = g.prj ? await lerTexto(g.prj) : undefined;
    var cpg = g.cpg ? (await lerTexto(g.cpg)).trim() : undefined;
    var geoms = shp.parseShp(await lerBuffer(g.shp), prj);
    var gj;
    if (g.dbf) {
        gj = shp.combine([geoms, shp.parseDbf(await lerBuffer(g.dbf), cpg)]);
    } else {
        gj = {
            type: 'FeatureCollection',
            features: geoms.map(function (geo) { return { type: 'Feature', properties: {}, geometry: geo }; })
        };
    }
    return [{ titulo: g.nome, gj: gj, formato: 'Shapefile' }];
}

/* ===== Camadas vetoriais (arquivos) ===== */
var PROP_ESTILO = /^(stroke|stroke-width|stroke-opacity|fill|fill-opacity|marker-color|marker-size|marker-symbol|icon|styleUrl|styleHash|styleMapHash|_umap_options)$/;

function estiloFeicao(f, cor) {
    var p = (f && f.properties) || {};
    var tipo = (f && f.geometry && f.geometry.type) || '';
    if (/Point/.test(tipo)) {
        return { radius: 6, color: '#ffffff', weight: 1, opacity: 1, fillColor: p['marker-color'] || cor, fillOpacity: 0.85 };
    }
    return {
        color: p.stroke || cor,
        weight: +p['stroke-width'] || 2,
        opacity: p['stroke-opacity'] != null ? +p['stroke-opacity'] : 1,
        fillColor: p.fill || cor,
        fillOpacity: p['fill-opacity'] != null ? +p['fill-opacity'] : 0.3
    };
}

function popupFeicao(props) {
    var linhas = '';
    Object.keys(props || {}).forEach(function (k) {
        var v = props[k];
        if (PROP_ESTILO.test(k) || v === null || v === undefined || v === '') return;
        if (typeof v === 'object') v = JSON.stringify(v);
        linhas += '<tr><th scope="row">' + escHtml(k) + ':</th><td>' + escHtml(v) + '</td></tr>';
    });
    return linhas ? '<table>' + linhas + '</table>' : '';
}

function criarCamadaVetorial(gj, cor) {
    var feats = (gj.features || []).filter(function (f) { return f && f.geometry; });
    if (!feats.length) throw new Error('nenhuma feição com geometria');
    var opcoes = {
        pane: 'pane_usuario',
        style: function (f) { return estiloFeicao(f, cor); },
        onEachFeature: function (f, l) {
            var h = popupFeicao(f.properties);
            if (h) l.bindPopup(h, { maxHeight: 300 });
        }
    };
    if (feats.length > 3000) opcoes.renderer = L.canvas({ pane: 'pane_usuario' });
    opcoes.pointToLayer = function (f, ll) {
        return L.circleMarker(ll, { pane: 'pane_usuario', renderer: opcoes.renderer });
    };
    var layer = L.geoJSON({ type: 'FeatureCollection', features: feats }, opcoes);
    var b = layer.getBounds();
    if (!b.isValid() || b.getSouth() < -90 || b.getNorth() > 90 || b.getWest() < -180 || b.getEast() > 180) {
        throw new Error('coordenadas fora do intervalo geográfico (falta o .prj ou o sistema de coordenadas?)');
    }
    return { layer: layer, n: feats.length };
}

/* ===== Operações sobre o registro ===== */
function buscarPorId(id) {
    for (var i = 0; i < camadasUsuario.length; i++) if (camadasUsuario[i].id === id) return camadasUsuario[i];
    return null;
}

function buscarPorChave(chave) {
    for (var i = 0; i < camadasUsuario.length; i++) if (camadasUsuario[i].chave === chave) return camadasUsuario[i];
    return null;
}

function sincronizarAtivas(e) {
    if (e.tipo === 'wms') {
        if (e.visivel) wmsAtivas[e.chave] = e; else delete wmsAtivas[e.chave];
    } else {
        if (e.visivel) arquivosAtivos[e.id] = e; else delete arquivosAtivos[e.id];
    }
}

function definirVisivel(e, v) {
    e.visivel = v;
    if (v) { if (!map.hasLayer(e.layer)) e.layer.addTo(map); }
    else if (map.hasLayer(e.layer)) map.removeLayer(e.layer);
    sincronizarAtivas(e);
}

function aplicarOpacidadeVetor(l, v) {
    if (l.eachLayer && !l.setStyle) { l.eachLayer(function (s) { aplicarOpacidadeVetor(s, v); }); return; }
    if (l.eachLayer) l.eachLayer(function (s) { aplicarOpacidadeVetor(s, v); });
    if (!l.setStyle) return;
    if (l._fo0 == null) l._fo0 = l.options.fillOpacity != null ? l.options.fillOpacity : 0;
    if (l._op0 == null) l._op0 = l.options.opacity != null ? l.options.opacity : 1;
    l.setStyle({ opacity: l._op0 * v, fillOpacity: l._fo0 * v });
}

function definirOpacidade(e, v) {
    e.opacity = v;
    if (e.tipo === 'wms') e.layer.setOpacity(v);
    else e.layer.eachLayer(function (l) { aplicarOpacidadeVetor(l, v); });
}

function removerCamada(e) {
    if (map.hasLayer(e.layer)) map.removeLayer(e.layer);
    e.visivel = false;
    sincronizarAtivas(e);
    camadasUsuario.splice(camadasUsuario.indexOf(e), 1);
}

function zoomParaCamada(e) {
    var b = e.tipo === 'arquivo' ? e.layer.getBounds() : e.bbox;
    if (b && b.isValid()) map.fitBounds(b, { maxZoom: 17 });
}

function registrarCamada(e) {
    e.id = 'c' + (++contadorCamadas);
    e.visivel = true;
    camadasUsuario.push(e);
    e.layer.addTo(map);
    sincronizarAtivas(e);
    return e;
}

function injetarEstiloINDE() {
    if (document.getElementById('estilo-inde')) return;
    var st = document.createElement('style');
    st.id = 'estilo-inde';
    st.textContent = [
        '.inde-bloco{border-bottom:1px solid #ECEEE8;margin-bottom:10px;padding-bottom:10px;font-size:12px}',
        '.inde-bloco h4{margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#024B30}',
        '.inde-bloco select,.inde-bloco input[type=text]{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #c9d3cc;border-radius:6px;font:inherit;background:#fff;color:#024B30}',
        '.inde-linha{display:flex;gap:6px;margin-top:6px}',
        '.inde-linha input{flex:1;min-width:0}',
        '.inde-btn{border:none;border-radius:6px;background:#eef1ee;color:#024B30;cursor:pointer;padding:4px 8px;font-size:14px;line-height:1;font-family:inherit}',
        '.inde-btn:hover{background:#d8e6dd}',
        '.inde-btn.inde-texto{font-size:12px;padding:5px 8px}',
        '.inde-status{margin-top:6px;color:#4a5f55}',
        '.inde-erro{color:#a02a1c}',
        '.inde-lista{margin-top:6px;max-height:240px;overflow-y:auto;border:1px solid #ECEEE8;border-radius:6px;background:#fff}',
        '.inde-lista label{display:flex!important;align-items:flex-start!important;gap:6px;padding:5px 8px;margin:0!important;border-bottom:1px solid #f1f3f1;cursor:pointer}',
        '.inde-lista label input{margin-top:2px;flex:none}',
        '.inde-lista small{display:block;color:#7a8b82}',
        /* abas e seletor de fonte */
        '.inde-abas{display:flex;gap:6px;margin-bottom:10px}',
        '.inde-aba{flex:1;border:1px solid #c9d3cc;border-radius:6px;background:#fff;color:#024B30;cursor:pointer;padding:7px 6px;font:inherit;font-size:12px;font-weight:600}',
        '.inde-aba.ativo{background:#024B30;color:#fff;border-color:#024B30}',
        '.inde-cont{display:inline-block;min-width:16px;padding:0 4px;margin-left:4px;border-radius:8px;background:#FFCD61;color:#024B30;font-size:11px;line-height:16px}',
        '.inde-fontes{display:flex;gap:0;margin-bottom:8px}',
        '.inde-fonte{flex:1;border:1px solid #c9d3cc;background:#fff;color:#024B30;cursor:pointer;padding:5px 6px;font:inherit;font-size:12px}',
        '.inde-fonte:first-child{border-radius:6px 0 0 6px}',
        '.inde-fonte:last-child{border-radius:0 6px 6px 0;border-left:none}',
        '.inde-fonte.ativo{background:#FFCD61;font-weight:700}',
        /* área de arquivos */
        '.inde-drop{display:block;border:2px dashed #9db8a8;border-radius:8px;padding:14px 10px;text-align:center;cursor:pointer;color:#024B30;background:#f7faf8}',
        '.inde-drop.sobre{background:#fff8e6;border-color:#FFCD61}',
        '.inde-drop b{display:block;margin-bottom:2px}',
        '.inde-drop small{color:#5d7168}',
        '.inde-drop input{display:none}',
        /* administrar */
        '.adm-topo{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-weight:600}',
        '.adm-item{border:1px solid #ECEEE8;border-radius:8px;padding:7px 8px;margin-bottom:6px;background:#fff}',
        '.adm-l1{display:flex;align-items:center;gap:6px}',
        '.adm-nome{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.adm-tag{flex:none;border-radius:4px;background:#eef1ee;padding:1px 5px;font-size:10px;font-weight:700}',
        '.adm-l2{display:flex;align-items:center;gap:5px;margin-top:6px}',
        '.adm-l2 input[type=range]{flex:1;min-width:0;accent-color:#024B30}',
        '.adm-meta{display:block;margin-top:4px;color:#7a8b82;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.inde-vazio{padding:8px 2px;color:#4a5f55;font-style:italic}'
    ].join('');
    document.head.appendChild(st);
}

function montarPainelINDE(container) {
    var painel = container || document.querySelector('#map .leaflet-control-layers');
    if (!painel || painel.querySelector('.inde-bloco')) return;
    injetarEstiloINDE();

    var bloco = document.createElement('div');
    bloco.className = 'inde-bloco';
    bloco.innerHTML =
        '<h4>Adicionar camadas</h4>' +
        '<div class="inde-abas">' +
        '<button type="button" class="inde-aba ativo" data-vista="add">Adicionar</button>' +
        '<button type="button" class="inde-aba" data-vista="adm">Administrar camadas<span class="inde-cont">0</span></button>' +
        '</div>' +

        '<div class="inde-vista" data-vista="add">' +
        '<div class="inde-fontes">' +
        '<button type="button" class="inde-fonte ativo" data-fonte="wms">WMS (INDE)</button>' +
        '<button type="button" class="inde-fonte" data-fonte="arq">Arquivo</button>' +
        '</div>' +

        '<div class="inde-fonte-wms">' +
        '<select class="inde-sel"><option value="">---- Selecione um Serviço ----</option>' +
        AGENCIAS_WMS.map(function (a, i) {
            return '<option value="' + i + '">' + escHtml(a.sigla + ' - ' + a.nome) + '</option>';
        }).join('') + '</select>' +
        '<div class="inde-linha"><input type="text" class="inde-url" placeholder="http://...">' +
        '<button type="button" class="inde-btn inde-buscar" title="Pesquisar">&#128269;</button>' +
        '<button type="button" class="inde-btn inde-limpar" title="Limpar">&times;</button></div>' +
        '<div class="inde-status"></div>' +
        '<input type="text" class="inde-filtro" placeholder="Filtrar camadas" style="display:none;margin-top:6px">' +
        '<div class="inde-lista" style="display:none"></div>' +
        '</div>' +

        '<div class="inde-fonte-arq" style="display:none">' +
        '<label class="inde-drop"><b>Clique ou arraste os arquivos aqui</b>' +
        '<small>KML, KMZ, Shapefile (.zip ou .shp + .dbf + .prj), GeoPackage (.gpkg) e GeoJSON</small>' +
        '<input type="file" multiple accept=".kml,.kmz,.zip,.shp,.dbf,.prj,.cpg,.shx,.gpkg,.geojson,.json"></label>' +
        '<div class="inde-status"></div>' +
        '</div>' +
        '</div>' +

        '<div class="inde-vista" data-vista="adm" style="display:none"></div>';

    painel.appendChild(bloco);

    var sel = bloco.querySelector('.inde-sel');
    var inUrl = bloco.querySelector('.inde-url');
    var secWms = bloco.querySelector('.inde-fonte-wms');
    var secArq = bloco.querySelector('.inde-fonte-arq');
    var status = secWms.querySelector('.inde-status');
    var statusArq = secArq.querySelector('.inde-status');
    var filtro = bloco.querySelector('.inde-filtro');
    var lista = bloco.querySelector('.inde-lista');
    var admin = bloco.querySelector('.inde-vista[data-vista="adm"]');
    var vistaAdd = bloco.querySelector('.inde-vista[data-vista="add"]');
    var contador = bloco.querySelector('.inde-cont');
    var camadas = [];
    var urlAtual = '';

    /* ----- abas ----- */
    function mostrarVista(v) {
        vistaAdd.style.display = v === 'add' ? '' : 'none';
        admin.style.display = v === 'adm' ? '' : 'none';
        Array.prototype.forEach.call(bloco.querySelectorAll('.inde-aba'), function (b) {
            b.classList.toggle('ativo', b.getAttribute('data-vista') === v);
        });
        if (v === 'adm') desenharAdmin();
    }
    bloco.querySelector('.inde-abas').addEventListener('click', function (ev) {
        var b = ev.target.closest('.inde-aba');
        if (b) mostrarVista(b.getAttribute('data-vista'));
    });

    function mostrarFonte(f) {
        secWms.style.display = f === 'wms' ? '' : 'none';
        secArq.style.display = f === 'arq' ? '' : 'none';
        Array.prototype.forEach.call(bloco.querySelectorAll('.inde-fonte'), function (b) {
            b.classList.toggle('ativo', b.getAttribute('data-fonte') === f);
        });
    }
    bloco.querySelector('.inde-fontes').addEventListener('click', function (ev) {
        var b = ev.target.closest('.inde-fonte');
        if (b) mostrarFonte(b.getAttribute('data-fonte'));
    });

    /* ----- WMS: lista de camadas do serviço ----- */
    function desenharLista() {
        var termo = filtro.value.trim().toLowerCase();
        var html = '';
        camadas.forEach(function (c, i) {
            if (termo && (c.titulo + ' ' + c.nome + ' ' + c.grupo).toLowerCase().indexOf(termo) === -1) return;
            var e = buscarPorChave(urlAtual + '|' + c.nome);
            var marcada = e && e.visivel ? ' checked' : '';
            html += '<label><input type="checkbox" data-i="' + i + '"' + marcada + '><span>' +
                escHtml(c.titulo) + (c.grupo ? '<small>' + escHtml(c.grupo) + '</small>' : '') + '</span></label>';
        });
        lista.innerHTML = html || '<div style="padding:8px"><i>Nenhuma camada corresponde ao filtro</i></div>';
    }

    function atualizarTudo() {
        contador.textContent = camadasUsuario.length;
        if (lista.style.display !== 'none' && camadas.length) desenharLista();
        if (admin.style.display !== 'none') desenharAdmin();
    }

    function pesquisar() {
        var url = inUrl.value.trim().split('?')[0];
        if (!url) { status.textContent = 'Selecione um serviço ou informe uma URL.'; return; }
        status.className = 'inde-status';
        status.textContent = 'Carregando camadas...';
        filtro.style.display = lista.style.display = 'none';
        var req = url + '?service=WMS&version=1.3.0&request=GetCapabilities';
        fetch(req)
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (txt) {
                var doc = new DOMParser().parseFromString(txt, 'text/xml');
                var raiz = doc.getElementsByTagName('Layer')[0];
                if (!raiz) throw new Error('resposta sem camadas');
                urlAtual = url;
                camadas = coletarCamadas(raiz, '', [], null);
                if (!camadas.length) { status.textContent = 'Nenhuma camada encontrada.'; return; }
                status.textContent = camadas.length + ' camadas encontradas.';
                filtro.value = '';
                filtro.style.display = lista.style.display = 'block';
                desenharLista();
            })
            .catch(function (err) {
                console.error('WMS ' + url + ':', err);
                status.className = 'inde-status inde-erro';
                status.textContent = 'Falhou (' + err.message + '). Verifique a URL ou se o servidor permite acesso (CORS).';
            });
    }

    function alternarCamada(c, ligar) {
        var chave = urlAtual + '|' + c.nome;
        var e = buscarPorChave(chave);
        if (ligar) {
            if (e) { definirVisivel(e, true); }
            else {
                var l = L.tileLayer.wms(urlAtual, {
                    pane: 'pane_wms', layers: c.nome, format: 'image/png',
                    transparent: true, version: '1.3.0', opacity: 0.85, attribution: 'INDE'
                });
                registrarCamada({
                    tipo: 'wms', chave: chave, layer: l, url: urlAtual, nome: c.nome,
                    titulo: c.titulo, bbox: c.bbox, opacity: 0.85, formato: 'WMS'
                });
            }
        } else if (e) {
            removerCamada(e);
        }
        atualizarTudo();
    }

    sel.addEventListener('change', function () {
        inUrl.value = sel.value === '' ? '' : AGENCIAS_WMS[+sel.value].url;
    });
    bloco.querySelector('.inde-buscar').addEventListener('click', pesquisar);
    inUrl.addEventListener('keydown', function (e) { if (e.key === 'Enter') pesquisar(); });
    bloco.querySelector('.inde-limpar').addEventListener('click', function () {
        sel.value = ''; inUrl.value = ''; status.textContent = '';
        camadas = []; lista.innerHTML = '';
        filtro.style.display = lista.style.display = 'none';
    });
    filtro.addEventListener('input', desenharLista);
    lista.addEventListener('change', function (e) {
        var cb = e.target;
        if (cb.tagName !== 'INPUT') return;
        alternarCamada(camadas[+cb.getAttribute('data-i')], cb.checked);
    });

    /* ----- Arquivos ----- */
    var inArq = secArq.querySelector('input[type=file]');
    var drop = secArq.querySelector('.inde-drop');

    async function processarArquivos(arquivos) {
        var tarefas = [], grupos = {}, erros = [], adicionadas = 0, limites = null;
        var PARTES = ['shp', 'dbf', 'prj', 'cpg', 'shx'];

        arquivos.forEach(function (f) {
            var ext = extensao(f.name);
            if (PARTES.indexOf(ext) !== -1) {
                var k = baseNome(f.name).toLowerCase();
                grupos[k] = grupos[k] || { nome: baseNome(f.name) };
                grupos[k][ext] = f;
            } else {
                tarefas.push({ nome: f.name, exec: function () { return converterArquivo(f); } });
            }
        });
        Object.keys(grupos).forEach(function (k) {
            var g = grupos[k];
            if (!g.shp) { erros.push(g.nome + ': falta o arquivo .shp'); return; }
            tarefas.push({ nome: g.nome + '.shp', exec: function () { return converterShapefileSolto(g); } });
        });

        for (var i = 0; i < tarefas.length; i++) {
            statusArq.className = 'inde-status';
            statusArq.textContent = 'Lendo ' + tarefas[i].nome + ' (' + (i + 1) + '/' + tarefas.length + ')...';
            try {
                var itens = await tarefas[i].exec();
                itens.forEach(function (it) {
                    try {
                        var cor = PALETA[idxCor++ % PALETA.length];
                        var v = criarCamadaVetorial(it.gj, cor);
                        registrarCamada({
                            tipo: 'arquivo', titulo: it.titulo, formato: it.formato, cor: cor,
                            n: v.n, layer: v.layer, opacity: 1
                        });
                        limites = limites ? limites.extend(v.layer.getBounds()) : L.latLngBounds(v.layer.getBounds().getSouthWest(), v.layer.getBounds().getNorthEast());
                        adicionadas++;
                    } catch (err) {
                        erros.push(it.titulo + ': ' + err.message);
                    }
                });
            } catch (err) {
                console.error(tarefas[i].nome, err);
                erros.push(tarefas[i].nome + ': ' + err.message);
            }
        }

        if (limites && limites.isValid()) map.fitBounds(limites, { maxZoom: 17 });
        var msg = adicionadas ? adicionadas + ' camada(s) adicionada(s). Gerencie em "Administrar camadas".' : '';
        statusArq.className = 'inde-status' + (erros.length && !adicionadas ? ' inde-erro' : '');
        statusArq.innerHTML = escHtml(msg) +
            (erros.length ? '<div class="inde-erro">' + erros.map(escHtml).join('<br>') + '</div>' : '');
        atualizarTudo();
    }

    inArq.addEventListener('change', function () {
        var arquivos = Array.prototype.slice.call(inArq.files);
        inArq.value = '';
        if (arquivos.length) processarArquivos(arquivos);
    });
    ['dragenter', 'dragover'].forEach(function (n) {
        drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add('sobre'); });
    });
    ['dragleave', 'drop'].forEach(function (n) {
        drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.remove('sobre'); });
    });
    drop.addEventListener('drop', function (e) {
        var arquivos = Array.prototype.slice.call(e.dataTransfer.files);
        if (arquivos.length) processarArquivos(arquivos);
    });

    /* ----- Administrar camadas ----- */
    function desenharAdmin() {
        contador.textContent = camadasUsuario.length;
        if (!camadasUsuario.length) {
            admin.innerHTML = '<div class="inde-vazio">Nenhuma camada adicionada ainda. Use a aba "Adicionar" para incluir camadas WMS ou arquivos.</div>';
            return;
        }
        var html = '<div class="adm-topo"><span>' + camadasUsuario.length + ' camada(s)</span>' +
            '<button type="button" class="inde-btn inde-texto adm-limpar">Remover todas</button></div>';
        for (var i = camadasUsuario.length - 1; i >= 0; i--) {
            var e = camadasUsuario[i];
            var meta = e.tipo === 'wms'
                ? e.nome + ' · ' + e.url.replace(/^https?:\/\//, '')
                : e.n + ' feição(ões)';
            var podeZoom = e.tipo === 'arquivo' || !!e.bbox;
            html += '<div class="adm-item" data-id="' + e.id + '">' +
                '<div class="adm-l1">' +
                '<input type="checkbox" class="adm-vis" title="Mostrar/ocultar"' + (e.visivel ? ' checked' : '') + '>' +
                (e.tipo === 'arquivo' ? '<span style="width:10px;height:10px;border-radius:50%;flex:none;background:' + escHtml(e.cor) + '"></span>' : '') +
                '<span class="adm-nome" title="' + escHtml(e.titulo) + '">' + escHtml(e.titulo) + '</span>' +
                '<span class="adm-tag">' + escHtml(e.formato) + '</span></div>' +
                '<div class="adm-l2">' +
                '<input type="range" class="adm-op" min="0" max="100" value="' + Math.round(e.opacity * 100) + '" title="Opacidade">' +
                (podeZoom ? '<button type="button" class="inde-btn adm-zoom" title="Zoom para a camada">&#8982;</button>' : '') +
                '<button type="button" class="inde-btn adm-ren" title="Renomear">&#9998;</button>' +
                '<button type="button" class="inde-btn adm-rem" title="Remover">&#128465;</button></div>' +
                '<small class="adm-meta" title="' + escHtml(meta) + '">' + escHtml(meta) + '</small></div>';
        }
        admin.innerHTML = html;
    }

    function itemDoEvento(ev) {
        var el = ev.target.closest('.adm-item');
        return el ? buscarPorId(el.getAttribute('data-id')) : null;
    }

    admin.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t.closest('.adm-limpar')) {
            if (confirm('Remover todas as camadas adicionadas?')) {
                camadasUsuario.slice().forEach(removerCamada);
                atualizarTudo();
            }
            return;
        }
        var e = itemDoEvento(ev);
        if (!e) return;
        if (t.closest('.adm-zoom')) zoomParaCamada(e);
        else if (t.closest('.adm-rem')) { removerCamada(e); atualizarTudo(); }
        else if (t.closest('.adm-ren')) {
            var n = prompt('Novo nome da camada:', e.titulo);
            if (n && n.trim()) { e.titulo = n.trim(); atualizarTudo(); }
        }
    });
    admin.addEventListener('change', function (ev) {
        if (!ev.target.classList.contains('adm-vis')) return;
        var e = itemDoEvento(ev);
        if (e) { definirVisivel(e, ev.target.checked); atualizarTudo(); }
    });
    admin.addEventListener('input', function (ev) {
        if (!ev.target.classList.contains('adm-op')) return;
        var e = itemDoEvento(ev);
        if (e) definirOpacidade(e, ev.target.value / 100);
    });
}
