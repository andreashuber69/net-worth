// https://github.com/andreashuber69/net-worth#--
import { Prop, Vue } from "vue-property-decorator";

/** Defines common component functionality. */
export class ComponentBase<T> extends Vue {
    @Prop()
    public value?: T;

    /**
     * Provides the value.
     *
     * @description Provides whatever is set for `value`, but ensures that the value cannot be undefined.
     */
    public get checkedValue() {
        if (this.value === undefined) {
            throw new Error("No value set.");
        }

        return this.value;
    }

    public set checkedValue(value: T) {
        this.$emit("input", value);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** Gets the control with the supplied ref. */
    protected getControl(ref: string) {
        return this.$refs[ref] as Vue;
    }
}
