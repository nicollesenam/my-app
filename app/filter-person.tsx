import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useAtom } from "jotai";

import { ArrowRight, Funnel } from "lucide-react";
import React, { useState } from "react";
import { cardsAtom, totalPagesAtom } from "./components/cards/cards";

export default function FilterPerson() {
  const [, setCards] = useAtom(cardsAtom);
  const [, setTotalPages] = useAtom(totalPagesAtom);
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [startAge, setStartAge] = useState("");
  const [endAge, setEndAge] = useState("");

  const makeRequestWithFilters = async () => {
    const filterRequest = {
      sexo: gender,
      status,
      faixaIdadeInicial: startAge,
      faixaIdadeFinal: endAge,
    };

    try {
      const response = await axios.get(
        `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?sexo=${filterRequest.sexo}&status=${filterRequest.status}&faixaIdadeInicial=${filterRequest.faixaIdadeInicial}&faixaIdadeFinal=${filterRequest.faixaIdadeFinal}`
      );
      const data = response.data.content;
      const cards = data;
      setCards(cards);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const onStartAgeTyped = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartAge(event.target.value);
  };

  const onEndAgeTyped = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndAge(event.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Funnel className="size-8 ml-2 p-2 rounded-3xl from-neutral-600 cursor-pointer hover:shadow-md hover:rounded-3xl hover:scale-110 transition-shadow duration-300" />
      </PopoverTrigger>
      <PopoverContent className="w-[350px]" side="left">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtro</h4>
            <p className="text-sm text-muted-foreground">
              Filtre as informações dos cards.
            </p>
          </div>

          {/* Idade */}
          <div className="grid gap-1">
            <Label className="text-sm font-medium text-gray-800">Idade</Label>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
              <input
                type="number"
                placeholder="Mín"
                className="border rounded-md p-2 w-full h-[31px]"
                onChange={onStartAgeTyped}
              />
              <ArrowRight size={16} />
              <input
                type="number"
                placeholder="Máx"
                className="border rounded-md p-2 w-full h-[31px]"
                onChange={onEndAgeTyped}
              />
            </div>
          </div>

          {/* Gênero */}
          <div className="grid gap-1">
            <Label className="text-sm font-medium text-gray-800">Gênero</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid gap-1">
            <Label className="text-sm font-medium text-gray-800">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="localizado">Localizado</SelectItem>
                  <SelectItem value="desaparecido">Desaparecido</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="bg-gray-950/80"
            onClick={() => makeRequestWithFilters()}
          >
            Filtrar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
