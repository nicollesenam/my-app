"use server";
import axios from "axios";

export async function getPeopleData() {
  interface Person {
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

  let cards: Person[] = [];
  try {
    // endpoint containing 43 items
    const response = await axios.get(
      "https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=0&porPagina=43"
    );
    const data = response.data.content;
    cards = data;
  } catch (error) {
    console.log(error);
  }

  return cards;
}
