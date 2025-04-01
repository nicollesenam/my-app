import { useAtom } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  additionalInfoCurrentViewedCardAtom,
  currentViewedCardDetailAtom,
} from "../cards/cards";

interface MissingPersonInfo {
  ocoId: string;
  id: number;
  informacao: string;
  data: string;
  anexos: string[];
}

export function CardDetails() {
  const [currentCardViewedDetail] = useAtom(currentViewedCardDetailAtom);
  const [additionalMissingPersonInfo] = useAtom(
    additionalInfoCurrentViewedCardAtom
  );

  function formatName(name: string) {
    return name
      .split(" ") // Divide o nome em palavras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
      .join(" "); // Junta novamente as palavras com espaços
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageForbidden = (e: any) => {
    let result = e.currentTarget.src;
    result =
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
    return result;
  };

  return (
    <div className="flex flex-row gap-3" key={""}>
      <Card className="w-full max-w-[340px]" key={currentCardViewedDetail?.id}>
        <CardHeader>
          <CardTitle className="capitalize">
            {formatName(
              currentCardViewedDetail?.nome ? currentCardViewedDetail.nome : ""
            )}
          </CardTitle>
          <CardDescription>
            <span>Idade: </span>
            <span>
              {currentCardViewedDetail?.idade === 0
                ? "Desconhecida"
                : currentCardViewedDetail?.idade}
            </span>
          </CardDescription>
          <CardDescription className="">
            <span>Sexo: </span>
            <span className="capitalize">
              {formatName(
                currentCardViewedDetail?.sexo
                  ? currentCardViewedDetail.sexo
                  : ""
              )}
            </span>
          </CardDescription>
          <CardDescription className="space-y-1.5">
            <div className="w-full">
              <img
                className="object-cover rounded-(--radius-sm) w-full h-[500px]"
                alt="retrato da pessoa"
                src={
                  currentCardViewedDetail?.urlFoto
                    ? currentCardViewedDetail.urlFoto
                    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                onError={(e) => handleImageForbidden(e)}
              ></img>
            </div>

            {/* se não tiver data de localização, apenas data de desaparecimento = "desaparecido" */}
            {currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
              !currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao && (
                <Badge className="p-4">Desaparecido</Badge>
              )}

            {/* se tiver data de localização, e data de desaparecimento = "localizado" */}
            {currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
              currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao && (
                <Badge className="p-4">Localizado</Badge>
              )}
          </CardDescription>
        </CardHeader>
        {/* EM CASO DE DESAPARECIDO */}
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {additionalMissingPersonInfo?.map(
          (additionalInfo: MissingPersonInfo) => {
            return (
              <Card
                className="w-full max-w-[340px]  max-h-[300px]"
                key={additionalInfo.id}
              >
                <CardContent className="space-y-2 h-[160px]">
                  {additionalInfo.informacao && (
                    <div>
                      <span className="font-semibold">
                        Informações gerais:{" "}
                      </span>
                      <span>{additionalInfo.informacao}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Data: </span>
                    <span>
                      {format(
                        new Date(additionalInfo.data),
                        "dd 'de' MMMM 'de' yyyy, HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                    </span>
                  </div>

                  {additionalInfo.anexos.length > 0 && (
                    <div>
                      <span className="font-semibold">Anexos: </span>
                      <div className="w-full flex flex-col">
                        <ul>
                          {additionalInfo.anexos.map((anexo, index) => (
                            <a
                              key={anexo}
                              href={anexo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              <li>Anexo {index + 1}</li>
                            </a>
                          ))}{" "}
                        </ul>
                      </div>
                    </div>
                  )}

                  {additionalInfo.anexos.length <= 0 && (
                    <div>
                      <span className="font-semibold">
                        Esta ocorrência não possui anexos.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
