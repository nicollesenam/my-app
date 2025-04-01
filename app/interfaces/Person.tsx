export interface Person {
  id: number;
  nome: string;
  idade: number;
  sexo: string;
  vivo: true;
  urlFoto: string;
  ultimaOcorrencia: {
    dtDesaparecimento: string;
    dataLocalizacao: string;
    encontradoVivo: true;
    localDesaparecimentoConcat: string;
    ocorrenciaEntrevDesapDTO: {
      informacao: string;
      vestimentasDesaparecido: string;
    };
    listaCartaz: [
      {
        urlCartaz: string;
        tipoCartaz: string;
      }
    ];
    ocoId: 0;
  };
}
