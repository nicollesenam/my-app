import { MissingPersonInfo } from "@/app/interfaces/MissingPersonInfo";
import { Person } from "@/app/interfaces/Person";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { ptBR } from "date-fns/locale";
import { atom, useAtom } from "jotai";
import { format } from "path";

export const currentViewedCardDetailAtom = atom<Person>();
export const additionalInfoCurrentViewedCardAtom = atom<MissingPersonInfo[]>(
  []
);
export const isCurrentCardDetailPageAtom = atom<boolean>(false);

interface Card {
  card: Person;
}

export default function PersonCard({ card }: Card) {
  const [, setIsCurrentCardDetailPage] = useAtom(isCurrentCardDetailPageAtom); // verificar se a tela atual é a tela de detalhes do card
  const [, setCurrentViewedCardDetail] = useAtom(currentViewedCardDetailAtom); // setar o card que foi clicado
  const [, setAdditionalInfoCurrentViewedCard] = useAtom(
    additionalInfoCurrentViewedCardAtom
  ); // setar informações adicionais que foram enviadas da pessoa desaparecida
  function formatName(name: string) {
    return name
      .split(" ") // Divide o nome em palavras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
      .join(" "); // Junta novamente as palavras com espaços
  }

  const handleDetailClickCard = async (card: Person) => {
    setIsCurrentCardDetailPage(true);
    setCurrentViewedCardDetail(card);
    try {
      const ocorrenciaId = card?.ultimaOcorrencia.ocoId;
      const response = await axios.get(
        `https://abitus-api.geia.vip/v1/ocorrencias/informacoes-desaparecido?ocorrenciaId=${ocorrenciaId}`
      );
      const additionalMissingPersonInfo = response.data;
      setAdditionalInfoCurrentViewedCard(additionalMissingPersonInfo);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-transform hover:scale-[1.02]">
      <CardHeader className="px-0 py-0 pr-4 pl-4">
        <CardTitle>
          <h3 className="font-medium text-gray-900 text-wrap mb-2 h-[25px]">
            {formatName(card.nome)}
          </h3>
        </CardTitle>
        <CardDescription>
          <span className="font-medium mr-1">Idade: </span>
          <span>{card.idade === 0 ? "Desconhecida" : card.idade}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-medium mr-1">Sexo: </span>
          <span>{formatName(card.sexo)}</span>
        </CardDescription>
      </CardHeader>

      <div className="relative aspect-square bg-gray-100 border-b border-gray-200 h-[240px]">
        <img
          className="w-full h-full object-cover"
          alt={`Foto de ${card.nome}`}
          src={
            card.urlFoto
              ? card.urlFoto
              : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          }
          onError={(e) =>
            (e.currentTarget.src =
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
          }
        ></img>

        {/* se não tiver data de localização, apenas data de desaparecimento = "desaparecido" */}
        {card.ultimaOcorrencia.dtDesaparecimento &&
          !card.ultimaOcorrencia.dataLocalizacao && (
            <Badge className="rounded-4xl absolute bottom-2 left-2 bg-(--badge-missing)">
              Desaparecido
            </Badge>
          )}

        {/* se tiver data de localização, e data de desaparecimento = "localizado" */}
        {card.ultimaOcorrencia.dtDesaparecimento &&
          card.ultimaOcorrencia.dataLocalizacao && (
            <Badge className="rounded-4xl absolute bottom-2 left-2 bg-(--badge-found)">
              Localizado
            </Badge>
          )}
      </div>

      {/* EM CASO DE DESAPARECIDO */}
      <CardContent className="space-y-2 flex-grow p-4 text-sm bg-white">
        {card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao && (
          <div>
            <span className="font-medium text-gray-80">Informação: </span>
            <span>
              {card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
            </span>
          </div>
        )}
        {!card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao &&
          card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
            ?.vestimentasDesaparecido && (
            <div>
              <span className="font-medium text-gray-80">Vestimentas: </span>
              <span>
                {formatName(
                  card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    .vestimentasDesaparecido
                )}
              </span>
            </div>
          )}

        {!card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao &&
          card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
            ?.vestimentasDesaparecido == "" && (
            <div>
              <span className="font-medium text-gray-80">
                Informações não fornecidas.
              </span>
            </div>
          )}

        <div>
          <span className="font-medium text-gray-800">Local: </span>
          <span>{card.ultimaOcorrencia.localDesaparecimentoConcat}</span>
        </div>
        <div>
          <span className="font-medium text-gray-800">Data: </span>
          <span>
            {format(
              new Date(card.ultimaOcorrencia.dtDesaparecimento),
              "dd 'de' MMMM 'de' yyyy, HH:mm",
              {
                locale: ptBR,
              }
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t border-gray-100">
        <Button
          className="w-full text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-colors"
          variant="outline"
          onClick={() => handleDetailClickCard(card)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
