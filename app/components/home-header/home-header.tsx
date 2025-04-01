import FilterPerson from "@/app/filter-person";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  cardsAtom,
  locatedPeopleCountAtom,
  missingPeopleCountAtom,
  totalPagesAtom,
} from "../cards/cards";
import { useAtom } from "jotai";
import axios from "axios";
import { useState } from "react";

export default function HomeHeader() {
  const [locatedPeopleCount] = useAtom(locatedPeopleCountAtom);
  const [missingPeopleCount] = useAtom(missingPeopleCountAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setCards] = useAtom(cardsAtom);
  const [, setTotalPages] = useAtom(totalPagesAtom);

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

  return (
    <div className="flex justify-between">
      <div className="space-x-1">
        <span className="text-sm font-medium text-gray-700">
          Pessoas desaparecidas:
        </span>
        <Badge className="rounded-4xl bg-(--badge-missing) border">
          {missingPeopleCount}
        </Badge>
        <span className="text-sm font-medium text-gray-700">
          Pessoas encontradas:
        </span>
        <Badge className="rounded-4xl bg-(--badge-found) border">
          {locatedPeopleCount}
        </Badge>
      </div>

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
  );
}
