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
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import { Person } from "@/app/interfaces/Person";
import HomeHeader from "../home-header/home-header";
import PersonCard from "../person-card/person-card";

export const cardsAtom = atom<Person[]>([]);
export const totalPagesAtom = atom(1);
// export const currentViewedCardDetailAtom = atom<Person>();
// export const additionalInfoCurrentViewedCardAtom = atom<MissingPersonInfo[]>(
//   []
// );
// export const isCurrentCardDetailPageAtom = atom<boolean>(false);
export const missingPeopleCountAtom = atom<number>();
export const locatedPeopleCountAtom = atom<number>();

export default function Cards() {
  const cardsPerPage = 10;
  const [cards, setCards] = useAtom(cardsAtom);
  const [startIndex, setStartIndex] = useState(1);
  const [totalPages, setTotalPages] = useAtom(totalPagesAtom);
  const [, setLocatedPeopleCount] = useAtom(locatedPeopleCountAtom);
  const [, setMissingPeopleCount] = useAtom(missingPeopleCountAtom);

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

  return (
    <>
      <HomeHeader />
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        key={""}
      >
        {cards.map((card: Person) => {
          return <PersonCard key={card.id} card={card} />;
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
