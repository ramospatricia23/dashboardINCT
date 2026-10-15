/* Camadas WMS da INDE: selecionar serviço, clicar em pesquisar e carregar.
   Depende de: map (global) e do painel .leaflet-control-layers (Leaflet).
   Uso: chamar montarPainelINDE() depois de criar o controle de camadas. */
/* Camadas WMS da INDE com carregamento sob demanda.
   Depende de: map, overlaysTree e lay (L.control.layers.tree) globais. */

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

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var wmsAtivas = {};   // chave url|camada -> {layer, url, nome, titulo} das camadas WMS ligadas

function filhosLayer(el) {
    return Array.prototype.filter.call(el.children, function (c) { return c.localName === 'Layer'; });
}

function textoFilho(el, tag) {
    for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].localName === tag) return el.children[i].textContent;
    }
    return '';
}

/* Achata a árvore de Layers do GetCapabilities numa lista de camadas */
function coletarCamadas(el, grupo, saida) {
    var nome = textoFilho(el, 'Name');
    var titulo = textoFilho(el, 'Title') || nome;
    var filhos = filhosLayer(el);
    if (nome) saida.push({ nome: nome, titulo: titulo, grupo: grupo });
    var proximo = filhos.length && !nome ? (grupo ? grupo + ' › ' : '') + titulo : grupo;
    filhos.forEach(function (f) { coletarCamadas(f, proximo, saida); });
    return saida;
}

function injetarEstiloINDE() {
    if (document.getElementById('estilo-inde')) return;
    var st = document.createElement('style');
    st.id = 'estilo-inde';
    st.textContent =
        '.inde-bloco{border-bottom:1px solid #ECEEE8;margin-bottom:10px;padding-bottom:10px;font-size:12px}' +
        '.inde-bloco h4{margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#024B30}' +
        '.inde-bloco select,.inde-bloco input[type=text]{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #c9d3cc;border-radius:6px;font:inherit;background:#fff;color:#024B30}' +
        '.inde-linha{display:flex;gap:6px;margin-top:6px}' +
        '.inde-linha input{flex:1;min-width:0}' +
        '.inde-btn{border:none;border-radius:6px;background:#eef1ee;color:#024B30;cursor:pointer;padding:0 10px;font-size:15px;line-height:1}' +
        '.inde-btn:hover{background:#d8e6dd}' +
        '.inde-status{margin-top:6px;color:#4a5f55}' +
        '.inde-lista{margin-top:6px;max-height:240px;overflow-y:auto;border:1px solid #ECEEE8;border-radius:6px;background:#fff}' +
        '.inde-lista label{display:flex!important;align-items:flex-start!important;gap:6px;padding:5px 8px;margin:0!important;border-bottom:1px solid #f1f3f1;cursor:pointer}' +
        '.inde-lista label input{margin-top:2px;flex:none}' +
        '.inde-lista small{display:block;color:#7a8b82}';
    document.head.appendChild(st);
}

function montarPainelINDE(container) {
    var painel = container || document.querySelector('#map .leaflet-control-layers');
    if (!painel || painel.querySelector('.inde-bloco')) return;
    injetarEstiloINDE();

    var bloco = document.createElement('div');
    bloco.className = 'inde-bloco';
    bloco.innerHTML =
        '<h4>Camadas INDE (WMS)</h4>' +
        '<select class="inde-sel"><option value="">---- Selecione um Serviço ----</option>' +
        AGENCIAS_WMS.map(function (a, i) {
            return '<option value="' + i + '">' + escHtml(a.sigla + ' - ' + a.nome) + '</option>';
        }).join('') + '</select>' +
        '<div class="inde-linha"><input type="text" class="inde-url" placeholder="http://...">' +
        '<button type="button" class="inde-btn inde-buscar" title="Pesquisar">&#128269;</button>' +
        '<button type="button" class="inde-btn inde-limpar" title="Limpar">&times;</button></div>' +
        '<div class="inde-status"></div>' +
        '<input type="text" class="inde-filtro" placeholder="Filtrar camadas" style="display:none;margin-top:6px">' +
        '<div class="inde-lista" style="display:none"></div>';

    painel.appendChild(bloco);

    var sel = bloco.querySelector('.inde-sel');
    var inUrl = bloco.querySelector('.inde-url');
    var status = bloco.querySelector('.inde-status');
    var filtro = bloco.querySelector('.inde-filtro');
    var lista = bloco.querySelector('.inde-lista');
    var camadas = [];
    var urlAtual = '';

    function desenharLista() {
        var termo = filtro.value.trim().toLowerCase();
        var html = '';
        camadas.forEach(function (c, i) {
            if (termo && (c.titulo + ' ' + c.nome + ' ' + c.grupo).toLowerCase().indexOf(termo) === -1) return;
            var marcada = wmsAtivas[urlAtual + '|' + c.nome] ? ' checked' : '';
            html += '<label><input type="checkbox" data-i="' + i + '"' + marcada + '><span>' +
                escHtml(c.titulo) + (c.grupo ? '<small>' + escHtml(c.grupo) + '</small>' : '') + '</span></label>';
        });
        lista.innerHTML = html || '<div style="padding:8px"><i>Nenhuma camada corresponde ao filtro</i></div>';
    }

    function pesquisar() {
        var url = inUrl.value.trim().split('?')[0];
        if (!url) { status.textContent = 'Selecione um serviço ou informe uma URL.'; return; }
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
                camadas = coletarCamadas(raiz, '', []);
                if (!camadas.length) { status.textContent = 'Nenhuma camada encontrada.'; return; }
                status.textContent = camadas.length + ' camadas encontradas.';
                filtro.value = '';
                filtro.style.display = lista.style.display = 'block';
                desenharLista();
            })
            .catch(function (err) {
                console.error('WMS ' + url + ':', err);
                status.textContent = 'Falhou (' + err.message + '). Verifique a URL ou se o servidor permite acesso (CORS).';
            });
    }

    function alternarCamada(c, ligar) {
        var chave = urlAtual + '|' + c.nome;
        if (ligar) {
            var l = L.tileLayer.wms(urlAtual, {
                pane: 'pane_wms', layers: c.nome, format: 'image/png',
                transparent: true, version: '1.3.0', opacity: 0.85, attribution: 'INDE'
            });
            wmsAtivas[chave] = { layer: l, url: urlAtual, nome: c.nome, titulo: c.titulo };
            l.addTo(map);
        } else if (wmsAtivas[chave]) {
            map.removeLayer(wmsAtivas[chave].layer);
            delete wmsAtivas[chave];
        }
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
}
