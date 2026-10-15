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
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function textoFilho(el, tag) {
    for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].localName === tag) return el.children[i].textContent;
    }
    return '';
}

function filhosLayer(el) {
    return Array.prototype.filter.call(el.children, function (c) { return c.localName === 'Layer'; });
}

function nodoLayer(el, url) {
    var nome = textoFilho(el, 'Name');
    var titulo = textoFilho(el, 'Title') || nome;
    var filhos = filhosLayer(el).map(function (f) { return nodoLayer(f, url); }).filter(Boolean);

    if (filhos.length) {
        return { label: '<b>' + escHtml(titulo) + '</b>', collapsed: true, children: filhos };
    }
    if (nome) {
        return {
            label: escHtml(titulo),
            layer: L.tileLayer.wms(url, {
                pane: 'pane_wms',
                layers: nome,
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
                opacity: 0.85,
                attribution: 'INDE'
            })
        };
    }
    return null;
}

function linkCarregar(i, texto) {
    return { label: '<a href="#" onclick="carregarAgenciaWMS(' + i + '); return false;">' + texto + '</a>' };
}

/* Marca como aberto o caminho até um nó (senão o redesenho da árvore
   devolve cada grupo ao collapsed:true e o painel parece "fechar"),
   redesenha e mantém a rolagem do painel. */
function abrirCaminho(arvore, alvo) {
    for (var i = 0; i < arvore.length; i++) {
        var n = arvore[i];
        if (n === alvo) { n.collapsed = false; return true; }
        if (n.children && abrirCaminho(n.children, alvo)) { n.collapsed = false; return true; }
    }
    return false;
}

/* Lista todos os nós da árvore em profundidade (mesma ordem do DOM). */
function achatarArvore(arvore, saida) {
    arvore.forEach(function (n) {
        saida.push(n);
        if (n.children) achatarArvore(n.children, saida);
    });
    return saida;
}

/* Lê no DOM quais grupos o usuário deixou abertos e grava em n.collapsed,
   para o redesenho da árvore não fechar os grupos que já estavam abertos.
   Se a estrutura do DOM não bater com a árvore, não mexe em nada. */
function guardarEstadoGrupos(painel) {
    try {
        var nos = achatarArvore(overlaysTree, []);
        var els = painel.querySelectorAll('.leaflet-layerstree-node');
        if (els.length !== nos.length) return;
        nos.forEach(function (n, i) {
            if (!n.children) return;
            var filhos = null;
            for (var k = 0; k < els[i].children.length; k++) {
                if (els[i].children[k].classList.contains('leaflet-layerstree-children')) {
                    filhos = els[i].children[k];
                    break;
                }
            }
            if (!filhos) return;
            var fechado = els[i].classList.contains('closed') ||
                          getComputedStyle(filhos).display === 'none';
            n.collapsed = fechado;
        });
    } catch (e) { /* mantém o comportamento padrão */ }
}

function atualizarArvore(nodo) {
    var painel = document.querySelector('#map .leaflet-control-layers') || lay.getContainer();
    var rolagem = painel.scrollTop;
    guardarEstadoGrupos(painel);
    abrirCaminho(overlaysTree, nodo);
    lay.setOverlayTree(overlaysTree);

    /* Reaplica já (antes de pintar) a classe de painel aberto e a rolagem,
       caso o redesenho tenha recriado o controle. */
    if (typeof prepararPainel === 'function') prepararPainel();
    var novo = document.querySelector('#map .leaflet-control-layers') || painel;
    novo.scrollTop = rolagem;
    requestAnimationFrame(function () { novo.scrollTop = rolagem; });
}

function carregarAgenciaWMS(i) {
    var ag = AGENCIAS_WMS[i];
    var nodo = ag._nodo;
    nodo.children = [{ label: '<i>Carregando camadas...</i>' }];
    atualizarArvore(nodo);

    fetch(ag.url + '?service=WMS&version=1.3.0&request=GetCapabilities')
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        })
        .then(function (txt) {
            var doc = new DOMParser().parseFromString(txt, 'text/xml');
            var raiz = doc.getElementsByTagName('Layer')[0];
            if (!raiz) throw new Error('resposta sem camadas');
            var filhos = filhosLayer(raiz).map(function (f) { return nodoLayer(f, ag.url); }).filter(Boolean);
            if (!filhos.length) {
                var unico = nodoLayer(raiz, ag.url);
                if (unico) filhos = [unico];
            }
            nodo.children = filhos.length ? filhos : [{ label: '<i>Nenhuma camada encontrada</i>' }];
            atualizarArvore(nodo);
        })
        .catch(function (err) {
            console.error('WMS ' + ag.sigla + ':', err);
            nodo.children = [
                { label: '<i>Falhou (' + escHtml(err.message) + ')</i>' },
                linkCarregar(i, 'Tentar de novo')
            ];
            atualizarArvore(nodo);
        });
}

function grupoINDE() {
    return {
        label: '<b>Camadas INDE (WMS)</b>',
        collapsed: true,
        children: AGENCIAS_WMS.map(function (ag, i) {
            ag._nodo = {
                label: '<b>' + escHtml(ag.sigla) + '</b> <small>' + escHtml(ag.nome) + '</small>',
                collapsed: true,
                children: [linkCarregar(i, 'Carregar camadas')]
            };
            return ag._nodo;
        })
    };
}
