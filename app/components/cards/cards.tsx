import { format } from "date-fns";
import FilterPerson from "@/app/filter-person";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import axios from "axios";
import { ptBR } from "date-fns/locale";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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

interface MissingPersonInfo {
  ocoId: string;
  id: number;
  informacao: string;
  data: string;
  anexos: string[];
}

export const cardsAtom = atom<Person[]>([]);
export const totalPagesAtom = atom(1);
export const currentViewedCardDetailAtom = atom<Person>();
export const additionalInfoCurrentViewedCardAtom = atom<MissingPersonInfo[]>(
  []
);
export const isCurrentCardDetailPageAtom = atom<boolean>(false);

export default function Cards() {
  const [, setIsCurrentCardDetailPage] = useAtom(isCurrentCardDetailPageAtom); // verificar se a tela atual é a tela de detalhes do card
  const [, setCurrentViewedCardDetail] = useAtom(currentViewedCardDetailAtom); // setar o card que foi clicado
  const [, setAdditionalInfoCurrentViewedCard] = useAtom(
    additionalInfoCurrentViewedCardAtom
  ); // setar informações adicionais que foram enviadas da pessoa desaparecida
  const cardsPerPage = 10;
  const [cards, setCards] = useAtom(cardsAtom);
  const [startIndex, setStartIndex] = useState(1);
  const [totalPages, setTotalPages] = useAtom(totalPagesAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [locatedPeopleCount, setLocatedPeopleCount] = useState<number>();
  const [missingPeopleCount, setMissingPeopleCount] = useState<number>();

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

  useEffect(() => {
    getPeopleData(startIndex);
    getLocatedAndMissingPeopleCount();
  }, [startIndex]);

  const getPeopleData = async (start: number) => {
    try {
      const response = await axios.get(
        `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=${start}&porPagina=${cardsPerPage}`
      );
      const data = response.data.content;
      const cards = data;
      setCards(cards);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const typedArr = [];
    typedArr.push(searchTerm);

    typedArr.forEach(async (letter) => {
      try {
        const response = await axios.get(
          `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?nome=${letter}`
        );
        const data = response.data.content;
        const cards = data;
        setCards(cards);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getLocatedAndMissingPeopleCount = async () => {
    try {
      const response = await axios.get(
        "https://abitus-api.geia.vip/v1/pessoas/aberto/estatistico"
      );
      const data = response.data;
      const locatedPeopleCount = data.quantPessoasEncontradas;
      const missingPeopleCount = data.quantPessoasDesaparecidas;
      setLocatedPeopleCount(locatedPeopleCount);
      setMissingPeopleCount(missingPeopleCount);
    } catch (error) {
      console.log(error);
    }
  };

  function formatName(name: string) {
    return name
      .split(" ") // Divide o nome em palavras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
      .join(" "); // Junta novamente as palavras com espaços
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="space-x-1">
          <span>Pessoas desaparecidas: </span>
          <Badge>{missingPeopleCount}</Badge>
          <span>Pessoas encontradas: </span>
          <Badge>{locatedPeopleCount}</Badge>
        </div>
        {/* grid w-full items-center gap-1.5 sm:max-w-sm md:max-w-2 lg:max-w-0 lg:hover:max-w-100 hover:transition-transform duration-1000 ease-out-in */}
        <div className="grid w-100 items-center sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="relative flex items-center">
            <div className="absolute left-2.5 top-2.5 size-4 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <Input
              placeholder="Buscar pessoa..."
              className="rounded-lg bg-background pl-8"
              inputMode="search"
              onChange={onSearch}
            />
            <FilterPerson></FilterPerson>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        key={""}
      >
        {cards.map((card: Person) => {
          return (
            <Card className="w-full max-w-[340px]" key={card.id}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {formatName(card.nome)}
                </CardTitle>
                <CardDescription>
                  <span>Idade: </span>
                  <span>{card.idade === 0 ? "Desconhecida" : card.idade}</span>
                </CardDescription>
                <CardDescription className="">
                  <span>Sexo: </span>
                  <span className="capitalize">{formatName(card.sexo)}</span>
                </CardDescription>
                <CardDescription className="space-y-1.5">
                  <div className="w-full">
                    <img
                      className="object-cover rounded-(--radius-sm) w-full h-[200px]"
                      alt="retrato da pessoa"
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
                  </div>

                  {/* se não tiver data de localização, apenas data de desaparecimento = "desaparecido" */}
                  {card.ultimaOcorrencia.dtDesaparecimento &&
                    !card.ultimaOcorrencia.dataLocalizacao && (
                      <Badge className="pt-3.5 pb-3.5 pl-2.5 pr-2.5">
                        Desaparecido
                      </Badge>
                    )}

                  {/* se tiver data de localização, e data de desaparecimento = "localizado" */}
                  {card.ultimaOcorrencia.dtDesaparecimento &&
                    card.ultimaOcorrencia.dataLocalizacao && (
                      <Badge className="pt-3.5 pb-3.5 pl-2.5 pr-2.5">
                        Localizado
                      </Badge>
                    )}
                </CardDescription>
              </CardHeader>
              {/* EM CASO DE DESAPARECIDO */}
              <CardContent className="space-y-2 h-[160px]">
                {card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao && (
                  <div>
                    <span className="font-semibold">Informação: </span>
                    <span>
                      {
                        card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                          .informacao
                      }
                    </span>
                  </div>
                )}
                {!card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao &&
                  card.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    ?.vestimentasDesaparecido && (
                    <div>
                      <span className="font-semibold">Vestimentas: </span>
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
                      <span className="font-semibold">
                        Informações não fornecidas.
                      </span>
                    </div>
                  )}

                <div>
                  <span className="font-semibold">Local: </span>
                  <span>
                    {card.ultimaOcorrencia.localDesaparecimentoConcat}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Data: </span>
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
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleDetailClickCard(card)}>
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`cursor-pointer ${
                startIndex === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => setStartIndex((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>

          <PaginationItem className="cursor-pointer">
            <PaginationLink
              isActive
              onClick={() => setStartIndex((prev) => Math.max(prev - 1, 1))}
            >
              {startIndex}
            </PaginationLink>
            <PaginationLink
              onClick={() =>
                setStartIndex((prev) => Math.min(prev + 1, totalPages))
              }
            >
              {startIndex + 1}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={`cursor-pointer ${
                startIndex === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                setStartIndex((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
