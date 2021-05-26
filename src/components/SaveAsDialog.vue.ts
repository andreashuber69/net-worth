// https://github.com/andreashuber69/net-worth#--
import { Component, Vue } from "vue-property-decorator";

import { TextInputInfo } from "../model/TextInputInfo";

import type { IVueForm } from "./IVueForm";
import TextField from "./TextField.vue";

// eslint-disable-next-line @typescript-eslint/naming-convention
@Component({ components: { TextField } })
/** Implements the dialog used during Save As... */
// eslint-disable-next-line import/no-default-export
export default class SaveAsDialog extends Vue {
    public name = "";

    public isOpen = false;

    /** Provides the name input information. */
    public readonly nameInfo = new TextInputInfo({
        label: "Name", hint: "The name of the file.", isPresent: true, isRequired: true, schemaName: "Text",
    });

    public onSaveClicked() {
        if (this.isValid()) {
            this.close(this.name);
        }
    }

    public onCancelClicked() {
        this.close(undefined);
    }

    public async showDialog(name: string) {
        this.name = name;
        this.isOpen = true;

        return await new Promise<string | undefined>((resolve) => (this.resolve = resolve));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private resolve?: (value: string | undefined) => void;

    private isValid() {
        // The runtime type of this.$refs.form is VueComponent. It appears nobody has written typings for this yet.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this.$refs.form as any as IVueForm).validate();
    }

    private close(value: string | undefined) {
        this.isOpen = false;

        if (!this.resolve) {
            throw new Error("No resolve callback set!");
        }

        this.resolve(value);
    }
}
