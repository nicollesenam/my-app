"use client";

import { useAtom } from "jotai";
import { CardDetails } from "../card-details/card-details";
import Cards, { isCurrentCardDetailPageAtom } from "../cards/cards";
import { ArrowLeft, CircleCheck } from "lucide-react";
import AddPersonInformation, {
  sendingNewPersonInfoHasFinished,
} from "../add-person-information/add-person-information";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MainPage() {
  const [isCurrentCardDetailPage, setIsCurrentCardDetailPage] = useAtom(
    isCurrentCardDetailPageAtom
  );
  const [finishedSendingNewInfo] = useAtom(sendingNewPersonInfoHasFinished);

  const goBackToMainPage = () => {
    setIsCurrentCardDetailPage(false);
  };

  return (
    <div className="m-5">
      <div className="space-y-3 bg-neutral-200 w-full p-8 rounded-(--radius-sm)">
        {!isCurrentCardDetailPage && (
          <>
            <span className="font-semibold text-3xl">Início</span>
            <Cards />
          </>
        )}

        {isCurrentCardDetailPage && (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <ArrowLeft
                  className="cursor-pointer"
                  onClick={goBackToMainPage}
                />
                <span className="font-semibold text-3xl ml-2">
                  Detalhes do desaparecimento
                </span>
              </div>
              <AddPersonInformation />
            </div>
            <CardDetails />
            {finishedSendingNewInfo && (
              <Alert className="bg-success">
                <CircleCheck size={20} color="#2f792f" />
                <AlertTitle className="text-[#2f792f]">
                  Informação adicionada com sucesso!
                </AlertTitle>
                <AlertDescription className="text-[#2f792f]">
                  Obrigado pelas informações fornecidas.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  );
}
