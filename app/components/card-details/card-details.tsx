import { useAtom } from "jotai";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OcurrencesCard from "../occurrences-card/occurrences-card";
import {
  additionalInfoCurrentViewedCardAtom,
  currentViewedCardDetailAtom,
} from "../person-card/person-card";

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

  const handleAge = () => {
    return currentCardViewedDetail?.idade === 0
      ? "Desconhecida"
      : currentCardViewedDetail?.idade;
  };

  const handleName = () => {
    return currentCardViewedDetail?.nome
      ? currentCardViewedDetail?.nome
      : "Desconhecido";
  };

  const handleGender = () => {
    return currentCardViewedDetail?.sexo
      ? currentCardViewedDetail.sexo
      : "Desconhecido";
  };

  const handlePersonPhoto = () => {
    return currentCardViewedDetail?.urlFoto
      ? currentCardViewedDetail.urlFoto
      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
  };

  const isMissing = () => {
    return (
      currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
      !currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao
    );
  };

  const wasFound = () => {
    return (
      currentCardViewedDetail?.ultimaOcorrencia.dtDesaparecimento &&
      currentCardViewedDetail?.ultimaOcorrencia.dataLocalizacao
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" key={""}>
      <Card className="lg:col-span-1 " key={currentCardViewedDetail?.id}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 mb-1">
            {formatName(handleName())}
          </CardTitle>
          <CardDescription>
            <span className="text-gray-600">Idade: </span>
            <span>{handleAge()}</span>
          </CardDescription>
          <CardDescription className="">
            <span className="text-gray-600">Sexo: </span>
            <span className="capitalize">{formatName(handleGender())}</span>
          </CardDescription>
          <CardDescription className="space-y-1.5">
            <div className="w-full">
              <img
                className="object-cover rounded-(--radius-sm) w-full h-[500px]"
                alt="retrato da pessoa"
                src={handlePersonPhoto()}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
                }
              ></img>
            </div>

            {/* se não tiver data de localização, apenas data de desaparecimento = "desaparecido" */}
            {isMissing() && (
              <Badge className="rounded-4xl bg-(--badge-missing)">
                Desaparecido
              </Badge>
            )}

            {/* se tiver data de localização, e data de desaparecimento = "localizado" */}
            {wasFound() && (
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
            {additionalMissingPersonInfo.map((additionalInfo) => (
              <OcurrencesCard
                id={additionalInfo.id}
                key={additionalInfo.id + 1}
                informacao={additionalInfo.informacao}
                data={additionalInfo.data}
                anexos={additionalInfo.anexos}
                ocoId={additionalInfo.ocoId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
