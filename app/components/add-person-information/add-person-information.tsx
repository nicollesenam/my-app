import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  additionalInfoCurrentViewedCardAtom,
  currentViewedCardDetailAtom,
} from "../cards/cards";
import { atom, useAtom } from "jotai";
import axios from "axios";

export const sendingNewPersonInfoHasFinished = atom(false);

export default function AddPersonInformation() {
  const [attachment, setAttachment] = useState<string[]>([]);
  const [attachmentDescription, setAttachmentDescription] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [currentCardViewedDetail] = useAtom(currentViewedCardDetailAtom);
  const [, setSendingNewPersonInfoHasFinished] = useAtom(
    sendingNewPersonInfoHasFinished
  );

  const [additionalMissingPersonInfo, setAdditionalMissingPersonInfo] = useAtom(
    additionalInfoCurrentViewedCardAtom
  );

  const handleAttachment = () => {
    const target = event?.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const fileURL = URL.createObjectURL(file); // criar url temporária
      const fileArr = [];
      fileArr.push(fileURL);

      setAttachment(fileArr);
    }
  };

  const handleAttachmentDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAttachmentDescription(event.target.value);
  };

  const handleAdditionalInformation = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAdditionalInformation(event.target.value);
  };

  const handleSentInformation = async () => {
    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : "";
    const addInfoRequest = {
      informacao: additionalInformation,
      data: formattedDate,
      anexos: attachment,
      descricao: attachmentDescription,
      ocoId: currentCardViewedDetail?.ultimaOcorrencia.ocoId,
    };
    console.log(addInfoRequest);

    const formData = new FormData();
    addInfoRequest.anexos.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // enviar request
      await axios.post(
        `https://abitus-api.geia.vip/v1/ocorrencias/informacoes-desaparecido?informacao=${encodeURIComponent(
          addInfoRequest.informacao
        )}&descricao=${attachmentDescription}&data=${
          addInfoRequest.data
        }&ocoId=${addInfoRequest.ocoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // pegar os dados atualizados
      const response = await axios.get(
        `https://abitus-api.geia.vip/v1/ocorrencias/informacoes-desaparecido?ocorrenciaId=${addInfoRequest.ocoId}`
      );

      console.log("Dados atualizados:", response.data);
      setOpen(false);
      setSendingNewPersonInfoHasFinished(true);
      const temp = [...additionalMissingPersonInfo];
      temp.push(addInfoRequest);
      setAdditionalMissingPersonInfo(temp);
      // Atualizar o estado do componente para exibir as novas informações
    } catch (error) {
      console.error("Erro ao enviar informações:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-950/80 hover:bg-gray-950/100 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
          Adicionar Informações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar informações</DialogTitle>
          <DialogDescription>
            Caso você possua mais informações que possam auxiliar a encontrar
            esta pessoa, por favor, digite abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="picture">Anexo</Label>
            <Input
              className="cursor-pointer"
              id="picture"
              type="file"
              onChange={handleAttachment}
            />
          </div>
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Descrição do anexo
            </Label>
            <Input
              id="name"
              placeholder="Foto da pessoa"
              className="col-span-3"
              onChange={handleAttachmentDescription}
            />
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Data em que foi vista
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? (
                    format(date, "MM/dd/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Informações adicionais
            </Label>
            <Textarea
              onChange={handleAdditionalInformation}
              placeholder="Descrição do local, roupa que estava usando e etc."
            />
          </div>
        </div>
        <Button onClick={() => handleSentInformation()}>Enviar</Button>
      </DialogContent>
    </Dialog>
  );
}
