class NegociacaoController{

    constructor(){
        //Como não estamos utilizando jQuery, o comando abaixo serve
        //para simular o '$' do jQuery, que é a mesma coisa que 
        //documento.querySelector!
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        let self = this;
        this._listaNegociacoes = ProxyFactory.createProxy(new ListaNegociacoes(), ['adiciona', 'esvazia'], (model)=>{
            this._negociacoesView.update(model);
        })

        //this._listaNegociacoes = new ListaNegociacoes();
        this._negociacoesView = new NegociacoesView($('#negociacoesView'));

        this._mensagem = ProxyFactory.createProxy(new Mensagem(), ['texto'], (model)=>{
            this._mensagemView.update(model);
        })
        //this._mensagem = new Mensagem();
        this._mensagemView = new MensagemView($('#mensagemView'));
    }

    adiciona(event){
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        //this._listaNegociacoes.negociacoes.push(this._criaNegociacao());     Não se pode usar usada pois o método está blindado na classe ListaNegociacoes
        this._limpaFormulario();
        console.log(this._listaNegociacoes.negociacoes);
        this._negociacoesView.update(this._listaNegociacoes);
        this._mensagem.texto = "Negociação adicionada com sucesso!";
        this._mensagemView.update(this._mensagem);
    }

    //Importando dados do serviço!!!
    importaNegociacoes(){
        let service = new NegociacaoService(this._listaNegociacoes, this._mensagem);
        
        service.obterNegociacoesDaSemana()
        .then(service.obterNegociacoesDaAnterior())
        .then(service.obterNegociacoesDaRetrasada());
    }

    apaga(){
        this._listaNegociacoes.esvazia();
        this._negociacoesView.update(this._listaNegociacoes);
        this._mensagem.texto = "Negociações apagadas com sucesso!";
        this._mensagemView.update(this._mensagem);
    }

    _criaNegociacao(){
        return new Negociacao(DateHelper.textoParaData(this._inputData.value), this._inputQuantidade.value, this._inputValor.value);
    }

    _limpaFormulario(){
        this._inputData.value = "";
        this._inputQuantidade.value = 0;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }


}