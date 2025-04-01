import { useAtom } from "jotai";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" key={""}>
      <Card className="lg:col-span-1 " key={currentCardViewedDetail?.id}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 mb-1">
            {formatName(
              currentCardViewedDetail?.nome ? currentCardViewedDetail.nome : ""
            )}
          </CardTitle>
          <CardDescription>
            <span className="text-gray-600">Idade: </span>
            <span>
              {currentCardViewedDetail?.idade === 0
                ? "Desconhecida"
                : currentCardViewedDetail?.idade}
            </span>
          </CardDescription>
          <CardDescription className="">
            <span className="text-gray-600">Sexo: </span>
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
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
                }
              ></img>
            </div>

            {/* se não tiver data de localização, apenas data de desaparecimento = "desaparecido" */}
            {currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
              !currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao && (
                <Badge className="rounded-4xl bg-(--badge-missing)">
                  Desaparecido
                </Badge>
              )}

            {/* se tiver data de localização, e data de desaparecimento = "localizado" */}
            {currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
              currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao && (
                <Badge className="rounded-4xl bg-(--badge-found)">
                  Localizado
                </Badge>
              )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Occurrences Grid */}
      <div className="lg:col-span-3">
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalMissingPersonInfo.map(
              (additionalInfo: MissingPersonInfo) => {
                return (
                  <div
                    key={additionalInfo.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-[300px] flex flex-col overflow-hidden"
                  >
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-800">
                        Informações gerais:
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {additionalInfo.informacao}
                      </p>
                    </div>

                    {additionalInfo.data && (
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-800">Data:</h3>
                        <p className="text-gray-600">{additionalInfo.data}</p>
                      </div>
                    )}

                    {additionalInfo.anexos &&
                      additionalInfo.anexos.length > 0 && (
                        <div className="mb-2">
                          <h3 className="font-medium text-gray-800">Anexos:</h3>
                          <div className="overflow-y-auto max-h-[100px] pr-1">
                            {additionalInfo.anexos.map((attachment, index) => (
                              <a
                                key={attachment}
                                href={attachment}
                                target="_blank"
                                className="block text-blue-500 hover:text-blue-700 transition-colors mb-1"
                              >
                                <li>Anexo {index + 1}</li>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    {additionalInfo.anexos.length <= 0 && (
                      <p className="text-sm text-gray-500 italic mt-auto">
                        Esta ocorrência não possui anexos.
                      </p>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
