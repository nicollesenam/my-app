"use client";

import { useAtom } from "jotai";
import { CardDetails } from "../card-details/card-details";
import Cards from "../cards/cards";
import { ChevronLeft, CircleCheck } from "lucide-react";
import AddPersonInformation, {
  sendingNewPersonInfoHasFinished,
} from "../add-person-information/add-person-information";
import AlertPopup from "../alert-popup/alert-popup";
import { isCurrentCardDetailPageAtom } from "../person-card/person-card";

export default function MainPage() {
  const [isCurrentCardDetailPage, setIsCurrentCardDetailPage] = useAtom(
    isCurrentCardDetailPageAtom
  );
  const [finishedSendingNewInfo] = useAtom(sendingNewPersonInfoHasFinished);

  const goBackToMainPage = () => {
    setIsCurrentCardDetailPage(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="space-y-3 rounded-(--radius-sm) max-w-7xl mx-auto py-10">
        {!isCurrentCardDetailPage && (
          <>
            <span className="text-2xl font-bold text-gray-900 mb-2">
              Início
            </span>
            <Cards />
          </>
        )}

        {isCurrentCardDetailPage && (
          <>
            <div className="py-4 flex justify-between items-center border-b border-gray-200 mb-6">
              <button className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                <ChevronLeft
                  className="mr-1 h-5 w-5 cursor-pointer"
                  onClick={goBackToMainPage}
                />
                <span className="text-xl font-medium">
                  Detalhes do desaparecimento
                </span>
              </button>
              <AddPersonInformation />
            </div>
            <CardDetails />
            {finishedSendingNewInfo && (
              <AlertPopup
                title={"Informação adicionada com sucesso!"}
                description={"Obrigado pelas informações fornecidas."}
                icon={<CircleCheck size={20} color="#2f792f" />}
                classAlert={"text-[#2f792f]"}
                classTypeAlert={"bg-success"}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
